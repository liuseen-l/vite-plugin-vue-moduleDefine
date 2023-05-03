import path from 'node:path'
import fsp from 'node:fs/promises'
import { parse as babelParse } from '@babel/parser'
import { walk as _walk } from 'estree-walker'
import { parse as _parse, compileScript } from '@vue/compiler-sfc'
import type { File, Node as _Node } from '@babel/types'
import generate from '@babel/generator'
import type { TreeMark } from '../utils'
import { isBlockStatement, isFunctionDeclaration, isIdentifier, isVariableDeclaration, isVariableDeclarator } from '../utils'

type Node = _Node & TreeMark

interface Result {
  [key: string]: {
    genCode: string
    imports: ImportBinding[]
  }
}

const reg = /defineProps\(([.\r\b\s\S\n]*)\)/

interface ImportBinding {
  isType: boolean
  imported: string
  local: string
  source: string
  isFromSetup: boolean
  isUsedInTemplate: boolean
}

export async function processSetupImports(source: string, id: string): Promise<Result> {
  const { descriptor } = _parse(source)

  const imports = compileScript(descriptor, { id: 'v' }).imports!
  // to match the import with '.' or '..'
  const matchImports: {
    [k: string]: ImportBinding[]
  } = {}

  for (const key of Object.keys(imports)) {
    const source = imports[key].source
    // setup script，local file and identifier start with $
    if (imports[key].isFromSetup && source.startsWith('.') && key.startsWith('$')) {
      matchImports[source] = matchImports[source] || []
      matchImports[source].push(imports[key])
    }
  }

  const results: Result = {}

  for (const resolvePath of Object.keys(matchImports)) {
    const content = await fsp.readFile(path.resolve(id, `${resolvePath}.ts`), 'utf-8')
    if (content.match(reg)) {
      const genCode = parse(content, matchImports[resolvePath])
      results[resolvePath] = { imports: matchImports[resolvePath], genCode }
    }
  }
  return results
}

function codegen(res: WalkParse) {
  const { hoists, observed, nodeList } = res
  for (const i of hoists) {
    // console.log(...(observed[i].node as Node[]))
    const observeList = (observed[i].node as Node[])
    for (const o of observeList) {
      nodeList.add(o)
      if (o.childIdent) {
        o.childIdent.delete(i)
        if (o.childIdent.size > 0) {
          // console.log(i, o)
          codegen({ hoists: o.childIdent, observed, nodeList })
        }
      }
    }
  }
}

interface Observe {
  [key: string]: {
    node?: Node[]
  }
}

interface WalkParse {
  nodeList: Set<Node>
  hoists: Set<string>
  observed: Observe
}

export function walker(ast: File, imports: string[]): WalkParse {
  const nodeList: Set<Node> = new Set()

  const observed: Observe = {}

  const hoists: Set<string> = new Set()

  const isBlock: boolean[] = []
  const blokList: string[] = []
    ; (_walk as any)(ast, {
    enter(node: Node, parent?: Node) {
      if (parent) {
        node.mark = parent.mark
        node.childIdent = parent.childIdent
      }

      if (isBlockStatement(node))
        isBlock.push(true)
        // console.log(isBlock)

      if (isIdentifier(node)) {
        // console.log(node);

        if (imports.includes(node.name)) {
          node.mark = true
          parent!.mark = true
        }
        else if (node.name.startsWith('$')) {
          if (parent?.mark) {
            // push into hoist list
            hoists.add(node.name)
          } else {
            const inBlock = isBlock.at(-1)
            if ((isBlock.length >= 1 && inBlock && parent && (isFunctionDeclaration(parent) || isVariableDeclarator(parent)))) {
              blokList.push(node.name)
            } else {
              if ((inBlock && !blokList.includes(node.name)) || isBlock.length === 0) {
                // push into observed list
                // console.log(inBlock, node, blokList)
                observed[node.name] = observed[node.name] || { node: undefined }
                node.observed = true

                node!.childIdent = parent?.childIdent || (new Set<string>())
                node?.childIdent.add(node.name)
              }
            }
          }
        }
      }
    },
    leave(node: Node, parent?: Node) {
      if (isFunctionDeclaration(node)) {
        if (isIdentifier(node.id) && node.id.mark) {
          node.mark = true
          nodeList.add(node)
        } else if (isIdentifier(node.id) && node.id.observed) {
          // console.log(node.id.name)
          node.observed = true
          observed[node.id.name].node = observed[node.id.name].node || []
          observed[node.id.name].node?.push(node)
        }
      } else if (isVariableDeclarator(node)) {
        if (isIdentifier(node.id) && node.id.mark)
          node.mark = true
        else if (isIdentifier(node.id) && node.id.observed)
          node.observed = true
      } else if (isVariableDeclaration(node)) {
        const nodeTemp = node.declarations[0]
        if (isVariableDeclaration(node) && isVariableDeclarator(nodeTemp) && nodeTemp.mark) {
          nodeList.add(node)
        } else if (isVariableDeclaration(node) && isVariableDeclarator(nodeTemp) && nodeTemp.observed) {
          if (isIdentifier(nodeTemp.id) && nodeTemp.id.observed) {
            node.observed = true
            observed[nodeTemp.id.name].node = observed[nodeTemp.id.name].node || []
            observed[nodeTemp.id.name].node?.push(node)
          }
        }
      }
      if (isBlockStatement(node)) {
        if (isBlock.length === 1)
          blokList.length = 0
        isBlock.pop()
      }

      if (parent && node.childIdent) {
        if (!((isFunctionDeclaration(node) || isVariableDeclaration(node)) && isBlock.length === 0))
          parent.childIdent = node.childIdent
      }
    },
  })
  // console.log(456, hoists, observed)

  return {
    nodeList,
    hoists,
    observed,
  }
}

function parse(source: string, importOption: ImportBinding[]): string {
  const localList: string[] = importOption.map(i => i.local)
  const importedList: string[] = importOption.map(i => i.imported)
  const ast = babelParse(source, { sourceType: 'module' })
  const w = walker(ast, importedList)
  codegen(w)

  ast.program.body = ([...w.nodeList] as any[])
  const generation = generate(ast)
  return generation.code
}

export async function transform(code: string, id: string) {
  if (id.endsWith('vue')) {
    const res = await processSetupImports(code, id)
  }
}
