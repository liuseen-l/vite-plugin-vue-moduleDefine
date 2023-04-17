import { walk } from 'estree-walker'
import { parse } from 'acorn'

const script = `
const a =1
const b =2

`
const ast = parse(script, { ecmaVersion: 'latest', sourceType: 'module' })

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
