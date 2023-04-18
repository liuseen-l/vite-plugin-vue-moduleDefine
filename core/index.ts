import { parse as _parse } from "@babel/parser";
import { walk } from 'estree-walker'


// 处理 import 
function mark(source: string): string[] {
  // import 一个相对路径，没有.

  return ['da']
}

function generator(ast) {
  

}


function parse(source: string) {
  const ast = _parse(source)
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
  const ast = parse(source)


}



export default function () {

  return {
    name: "vite-plugin-vue-moduleDefine",
    enforce: "pre",
    transform(code: string, id: string) {
      if (id.endsWith('vue')) {
        // 拿到当前 vue 文件导入的所有的ts文件
        const res = mark(code)

        // 循环遍历



      }
    }
  }
}
