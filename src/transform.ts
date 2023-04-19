import path from 'node:path'
import fs from 'node:fs/promises'
import type { ParseResult } from '@babel/parser'
import { parse as baseParse } from '@babel/parser'
import generate from '@babel/generator'
import { walk } from 'estree-walker'
import { parse as _parse, compileScript } from '@vue/compiler-sfc'
import type * as _babel_types from '@babel/types'

const reg = /defineProps\(([.\r\b\s\S\n]*)\)/

interface ImportBinding {
  isType: boolean
  imported: string
  local: string
  source: string
  isFromSetup: boolean
  isUsedInTemplate: boolean
}

async function processSetupImports(source: string, id: string): Promise<void> {
  const { descriptor } = _parse(source)
  const imports = compileScript(descriptor, { id: 'v' }).imports!
  // to match the import with '.' or '..'
  const matchImports: {
    [k: string]: ImportBinding[]
  } = {}
  for (const key of Object.keys(imports)) {
    const source = imports[key].source
    if (imports[key].isFromSetup && source.startsWith('.')) {
      matchImports[source] = matchImports[source] || []
      matchImports[source].push(imports[key])
    }
  }

  for (const resolvePath of Object.keys(matchImports)) {
    const content = await fs.readFile(path.resolve(id, resolvePath), 'utf-8')
    if (content.match(reg))
      compile(content, matchImports[resolvePath])
  }
}

function generator(ast: ParseResult<_babel_types.File>): string {
  const generation = generate(ast)
  return generation.code
}

function parse(source: string, importOption: ImportBinding[]) {
  const localList: string[] = importOption.map(i => i.local)
  const importedList: string[] = importOption.map(i => i.imported)
  const ast = baseParse(source)
    ; (walk as any)(ast, {
    enter(node: Node, parent?: Node) {
      // some code happens
      // console.log('enter', node, parent)
    },
    leave(node: Node, parent?: Node) {
      // some code happens
      // console.log('leave', node, parent)
    },
  })
  generator(ast)
}
function compile(source: string, importOption: ImportBinding[]) {
  const ast = parse(source, importOption)
}

export async function transform(code: string, id: string) {
  if (id.endsWith('vue')) {
    // 拿到当前 vue 文件 setup 中导入的所有的ts文件
    const res = await processSetupImports(code, id)
    // 循环遍历
  }
}
