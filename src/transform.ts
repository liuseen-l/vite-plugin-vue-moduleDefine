import path from 'node:path'
import fsp from 'node:fs/promises'
import type { ParseResult } from '@babel/parser'
import { parse as bableParse } from '@babel/parser'
import { walk as _walk } from 'estree-walker'
import { parse as _parse, compileScript } from '@vue/compiler-sfc'
import type { File, Node as _Node } from '@babel/types'
import generate from '@babel/generator'
import type { TreeMark } from '../utils'
import { isFunctionDeclaration, isIdentifier, isVariableDeclaration, isVariableDeclarator } from '../utils'

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

function codegen(ast: ParseResult<File>, res: WalkParse): string {
  const { hoists, observed, nodeList } = res
  for (const i of hoists)
    nodeList.push(...(observed[i].node as Node[]))
  ast.program.body = (nodeList as any[])
  const generation = generate(ast)
  return generation.code
}

interface Observe {
  [key: string]: {
    node?: Node[]
  }
}

interface WalkParse {
  nodeList: Node[]
  hoists: string[]
  observed: Observe
}
export function walker(ast: File, imports: string[]): WalkParse {
  const nodeList: Node[] = []

  const observed: Observe = {}

  const hoists: Set<string> = new Set()
    ; (_walk as any)(ast, {
    enter(node: Node, parent?: Node) {
      if (parent)
        node.mark = parent.mark

      if (isIdentifier(node)) {
        if (imports.includes(node.name)) {
          node.mark = true
          parent!.mark = true
        } else if (node.name.startsWith('$')) {
          if (parent?.mark) {
            // push into hoist list
            hoists.add(node.name)
          } else {
            // push into observed list
            observed[node.name] = observed[node.name] || { node: undefined }
            node.observed = true
          }
        }
      }
    },
    leave(node: Node, parent?: Node) {
      if (isFunctionDeclaration(node)) {
        if (isIdentifier(node.id) && node.id.mark) {
          node.mark = true
          nodeList.push(node)
        } else if (isIdentifier(node.id) && node.id.observed) {
          node.observed = true
          observed[node.id.name].node = observed[node.id.name].node || []
          observed[node.id.name].node?.push(node)
        }
      } else if (isVariableDeclarator(node)) {
        if (isIdentifier(node.id) && node.id.mark)
          node.mark = true
        if (isIdentifier(node.id) && node.id.observed)
          node.observed = true
      } else if (isVariableDeclaration(node)) {
        const nodeTemp = node.declarations[0]
        if (isVariableDeclaration(node) && isVariableDeclarator(nodeTemp) && nodeTemp.mark) {
          nodeList.push(node)
        } else if (isVariableDeclaration(node) && isVariableDeclarator(nodeTemp) && nodeTemp.observed) {
          if (isIdentifier(nodeTemp.id) && nodeTemp.id.observed) {
            node.observed = true
            observed[nodeTemp.id.name].node = observed[nodeTemp.id.name].node || []
            observed[nodeTemp.id.name].node?.push(node)
          }
        }
      }
    },
  })
  // console.log(hoists, observed)

  return {
    nodeList,
    hoists: [...hoists],
    observed,
  }
}

function parse(source: string, importOption: ImportBinding[]): string {
  const localList: string[] = importOption.map(i => i.local)
  const importedList: string[] = importOption.map(i => i.imported)
  const ast = bableParse(source, { sourceType: 'module' })
  const w = walker(ast, importedList)
  return codegen(ast, w)
}

export async function transform(code: string, id: string) {
  if (id.endsWith('vue')) {
    const res = await processSetupImports(code, id)
  }
}
