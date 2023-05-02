import { walk as _walk } from 'estree-walker'
import { parse } from '@babel/parser'
import type { CallExpression, File, FunctionDeclaration, Identifier, VariableDeclaration, VariableDeclarator, Node as _Node } from '@babel/types'

interface t {
  mark: boolean
}

type Node = _Node & {
  mark: boolean
}

const script
  = `
const $props = defineProps({
  foo:String
})

function $useProps() {
  console.log(props.foo)
}

function test(){

}

const fn = () => {
  console.log(1)
}
`
const nodeList: Node[] = []

function isCallExpression(node: any): node is CallExpression & t {
  return node.type && node.type === 'CallExpression'
}

function isFunctionDeclaration(node: any): node is FunctionDeclaration & t {
  return node.type && node.type === 'FunctionDeclaration'
}

function isIdentifier(node: any): node is Identifier & t {
  return node.type && node.type === 'Identifier'
}

// function isMacro(node: Node): boolean {
//   if (isCallExpression(node)) {
//     if (isIdentifier(node.callee) && node.callee.name)
//       nodeList.push(node)
//     return true
//   }
//   return false
// }

function isVariableDeclarator(node: any): node is VariableDeclarator & t {
  return node.type && node.type === 'VariableDeclarator'
}

function isVariableDeclaration(node: any): node is VariableDeclaration & t {
  return node.type && node.type === 'VariableDeclaration'
}

const arry: string[] = ['$useProps', '$props']

function _parse(code: string) {
  return parse(script, { sourceType: 'module' }) as File
}

export function walk(ast: any) {
  (_walk as any)(ast, {
    enter(node: Node, parent?: Node) {
      if (isIdentifier(node)) {
        if (arry.includes(node.name))
          node.mark = true
      }
    },
    leave(node: Node, parent?: Node) {
      if (isFunctionDeclaration(node)) {
        // 被标记了
        if (isIdentifier(node.id) && node.id.mark)
          nodeList.push(node)
      } else if (isVariableDeclarator(node)) {
        if (isIdentifier(node.id) && node.id.mark)
          node.mark = true
      }
      else if (isVariableDeclaration(node)) {
        const nodeTemp = node.declarations[0]
        if (isVariableDeclaration(node) && isVariableDeclarator(nodeTemp) && nodeTemp.mark)
          nodeList.push(node)
      }
    },
  })
  ast.program.body = (nodeList as any[])
  return ast
}
