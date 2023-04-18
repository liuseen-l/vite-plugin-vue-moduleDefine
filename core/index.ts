import { parse as baseParse } from "@babel/parser";
import generate from "@babel/generator";
import { walk } from 'estree-walker'
import { parse as _parse, compileScript } from '@vue/compiler-sfc'
import fs from 'node:fs/promises'
import path from 'node:path'


// 处理 import 
async function processSetupImports(source: string, id: string): Promise<string[]> {
  const { descriptor } = _parse(source)
  const imports = compileScript(descriptor, { id: 'v' }).imports as object
  const matchImports = Object.keys(imports).filter(key =>
    imports[key].isFromSetup && key.startsWith('.'))

  for (const match of matchImports) {
    await fs.readFile(path.resolve(__dirname, id), 'utf-8')
  }
  return ['da']
}

function generator(ast): string {
  const code = generate(ast)
  return code
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
      }
    })
  generator(ast)
}


function compile(source: string) {
  const ast = parser(source)

}



export default () => {

  return {
    name: "vite-plugin-vue-moduleDefine",
    enforce: "pre",
    transform(code: string, id: string) {
      if (id.endsWith('vue')) {
        // 拿到当前 vue 文件 setup 中导入的所有的ts文件
        const res = processSetupImports(code, id)

        // 循环遍历


      }
    }
  }
}
