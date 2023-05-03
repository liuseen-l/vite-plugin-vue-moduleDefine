import type { BlockStatement, FunctionDeclaration, Identifier, VariableDeclaration, VariableDeclarator } from '@babel/types'

export interface TreeMark {
  mark?: boolean
  observed?: boolean
  childIdent?: string
}

export function isFunctionDeclaration(node: any): node is FunctionDeclaration & TreeMark {
  return node.type && node.type === 'FunctionDeclaration'
}

export function isIdentifier(node: any): node is Identifier & TreeMark {
  return node.type && node.type === 'Identifier'
}

export function isVariableDeclarator(node: any): node is VariableDeclarator & TreeMark {
  return node.type && node.type === 'VariableDeclarator'
}

export function isVariableDeclaration(node: any): node is VariableDeclaration & TreeMark {
  return node.type && node.type === 'VariableDeclaration'
}

export function isBlockStatement(node: any): node is BlockStatement {
  return node.type && node.type === 'BlockStatement'
}
