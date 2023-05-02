import { parse } from '@babel/parser'
import generate from '@babel/generator'

const code = 'class Example {}'
const ast = parse(code)

const output = generate(
  ast,
  {
    /* 选项 */
  },
  code,
)
