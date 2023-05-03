import { parse } from '@babel/parser'
import { parse as _parse, compileScript } from '@vue/compiler-sfc'

describe.skip('test ast', () => {
  test.skip('transfomr', () => {
    const script = `
    import {a} from 'vue'
    const props = defineProps({
      foo: String
    })
    const bar = 1

    function test(){
      console.log(props.foo+1)
    }
    
    `
    const ast = parse(script, { sourceType: 'module' })
  })
  test.skip('transfomr', () => {
    const script = `
    <script setup>
    import {d as t ,z}from './vue'
    import { x}from './react'
      let a = 1
      const b = 2
    function c() {}
    class d {}
    </script>
    <script>
    let aa = 1
    const bb = 2
    function cc() {}
    class dd {}
    </script>
    `
    const { descriptor } = _parse(script)
    const content = compileScript(descriptor, { id: 'v' })
  })
})
