import { parse as baseParse } from "@babel/parser";
import generate from "@babel/generator";
import { walk } from 'estree-walker'
import { parse as _parse, compileScript } from '@vue/compiler-sfc'

// 处理 import 
function mark(source: string): string[] {
  const { descriptor } = _parse(source)
  const imports = compileScript(descriptor, { id: 'v' }).content
  return imports ?
    Object.keys(imports).filter(key =>
      imports[key].isFromSetup && key.startsWith('.'))
    : []
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
        const res = mark(code)

        // 循环遍历


      }
    }
  }
}
