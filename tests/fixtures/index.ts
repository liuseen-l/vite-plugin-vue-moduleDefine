import { walk } from 'estree-walker'
import type { Node } from 'acorn'
import { parse } from 'acorn'
import type { CallExpression, Identifier, VariableDeclarator } from '@babel/types'

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

function isVariableDeclarator(node: any): node is VariableDeclarator {
  return node.type && node.type === 'VariableDeclarator'
}

function isMacros(node: Node): boolean {
  if (isVariableDeclarator(node) && isIdentifier(node.id) && isCallExpression(node.init)) {
    if (isIdentifier(node.init.callee) && node.init.callee.name)
      nodeList.push(node)
    return true
  }
  return false
}

const root: any = {
  type: 'Program',
  start: 0,
  end: 0,
  body: [],
  sourceType: 'module',
}

const ast = parse(script, { ecmaVersion: 'latest', sourceType: 'module' })
  ; (walk as any)(ast, {
  enter(node: Node, parent?: Node) {
    // some code happens
    const r = isMacros(node)

    // markRoot(node)

    if (r)
      this.remove()
    // console.log('enter', node)
  },
  leave(node: Node, parent?: Node) {
    // some code happens
    // console.log('leave', node)
  },
})

root.body.push(nodeList[0])
