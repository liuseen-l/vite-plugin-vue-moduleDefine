import { parse as baseParse } from "@babel/parser";
import generate from "@babel/generator";
import { walk } from 'estree-walker'
import { parse as _parse, compileScript } from '@vue/compiler-sfc'
import fs from 'node:fs/promises'
import path from 'node:path'

async function processSetupImports(source: string, id: string): Promise<string[]> {
  const { descriptor } = _parse(source)
  const imports = compileScript(descriptor, { id: 'v' }).imports as object
  // to match the import with '.' or '..'
  const matchImports: {
    [k: string]: { [t: string]: string }[]
  } = {}

  for (const key of Object.keys(imports)) {
    const source = imports[key].source
    if (imports[key].isFromSetup && source.startsWith('.')) {
      matchImports[source] = matchImports[source] || []
      matchImports[source].push(imports[key])
    }
  }

  const reg = /defineProps\(([.\b\s\S]*)\)/
  const markable: string[] = []

  for (const path of Object.keys(matchImports)) {
    // to filter the content without macros
    const content = await fs.readFile(path.resolve('da', path), 'utf-8')
    if (content.match(reg)) {
      compile(content, matchImports[key])
    }
  }
  return markable
}

function generator(ast) {
  const code = generate(ast)
  return code
}



function mergeMacros() {


}


function parse(source: string, importOption) {
  const local = importOption.local
  const imported = importOption.imported
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


function compile(source: string, importOption) {
  const ast = parse(source, importOption)

}



export default () => {

  return {
    name: "vite-plugin-vue-moduleDefine",
    enforce: "pre",
    async transform(code: string, id: string) {
      if (id.endsWith('vue')) {
        // 拿到当前 vue 文件 setup 中导入的所有的ts文件
        const matchList = await processSetupImports(code, id)

        // 循环遍历


      }
    }
  }
}
