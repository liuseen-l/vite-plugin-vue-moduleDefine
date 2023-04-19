import fs from 'node:fs/promises'
import path from 'node:path'
import type { ParseResult } from '@babel/parser'
import { parse as baseParse } from '@babel/parser'
import generate from '@babel/generator'
import { walk } from 'estree-walker'
import { parse as _parse, compileScript } from '@vue/compiler-sfc'
import type * as _babel_types from '@babel/types'

const reg = /defineProps\(([.\r\b\s\S\n]*)\)/

async function processSetupImports(source: string, id: string): Promise<string[]> {
  const { descriptor } = _parse(source)
  const imports = compileScript(descriptor, { id: 'v' }).imports
  const matchImports = Object.keys(imports as object).filter(key =>
    imports![key].isFromSetup && key.startsWith('.'))

  const resolvePaths: string[] = []
  for (const match of matchImports) {
    const content = await fs.readFile(path.resolve(__dirname, id), 'utf-8')
    content.match(reg) && resolvePaths.push(match)
  }

  return ['da']
}

function generator(ast: ParseResult<_babel_types.File>): string {
  const generation = generate(ast)
  return generation.code
}

function parser(source: string) {
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

function compile(source: string) {
  const ast = parser(source)
}

export async function transform(code: string, id: string) {
  if (id.endsWith('vue')) {
    // 拿到当前 vue 文件 setup 中导入的所有的ts文件
    const res = await processSetupImports(code, id)
    // 循环遍历
  }
}
