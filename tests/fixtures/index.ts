import { walk } from 'estree-walker'
import type { Node } from 'acorn'
import { parse } from 'acorn'
import type { CallExpression, Identifier } from '@babel/types'

const script
  = `const props = defineProps({
  foo:String
})
`
const nodeList: Node[] = []

function isCallExpression(node: any): node is CallExpression {
  return node.type && node.type === 'CallExpression'
}

function isIdentifier(node: any): node is Identifier {
  return node.type && node.type === 'Identifier'
}

function isMacro(node: Node): boolean {
  if (isCallExpression(node)) {
    if (isIdentifier(node.callee) && node.callee.name)
      nodeList.push(node)
    return true
  }
  return false
}

const ast = parse(script, { ecmaVersion: 'latest', sourceType: 'module' })

  ; (walk as any)(ast, {
  enter(node: Node, parent?: Node) {
    // some code happens
    // if (node.type && node.type === 'CallExpression' && node.callee.name === 'defineProps')
    const r = isMacro(node)
    if (r)
      this.remove()
    // console.log('enter', node)
  },
  leave(node: Node, parent?: Node) {
    // some code happens
    // console.log('leave', node)
  },
})

console.log(nodeList)
