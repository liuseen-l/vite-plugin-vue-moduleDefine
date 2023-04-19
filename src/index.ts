import { transform } from './transform'

export default function moduleDefine() {
  return {
    name: 'vite-plugin-vue-moduleDefine',
    enforce: 'pre',
    transform,
  }
}
