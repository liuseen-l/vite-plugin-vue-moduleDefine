import path from 'node:path'
import { processSetupImports } from '../src/transform'

describe('test case', () => {
  const resolvePath = path.resolve(__dirname, './fixtures')
  test('间接依赖', async () => {
    const source = `
    <script setup lang="ts">
      import { $useArrow, $useFun, useNormal } from './test1'

      useNormal()
      $useArrow()
      $useFun()

    </script>
    `

    const r = await processSetupImports(source, resolvePath)

    expect(r['./test1'].genCode).toMatchInlineSnapshot(`
      "function $useArrow() {}
      const $useFun = () => {
        $useTT();
      };
      function $useTT() {
        $useProps();
      }
      function $useProps() {
        console.log($props.foo);
      }
      const $props = defineProps(['foo']);"
    `)
  })

  test('过滤非导入的依赖项', async () => {
    const source = `
    <script setup lang="ts">
      import { $useFun } from './test2'

      $useFun()

    </script>
    `

    const r = await processSetupImports(source, resolvePath)

    expect(r['./test2'].genCode).toMatchInlineSnapshot(`
      "function $useFun() {
        console.log($props.foo);
      }
      const $props = defineProps({
        foo: String
      });"
    `)
  })

  test('参数包含依赖项', async () => {
    const source = `
    <script setup lang="ts">
      import { $useFun } from './test3'

      $useFun()

    </script>
    `

    const r = await processSetupImports(source, resolvePath)

    expect(r['./test3'].genCode).toMatchInlineSnapshot(`
      "const $useFun = () => {
        // $useTT()
        $useProps($useArrow());
      };
      function $useProps(a) {
        console.log($props.foo);
      }
      const $props = defineProps(['foo']);
      function $useArrow() {
        return 1;
      }"
    `)
  })

  test('跳过内部声明的函数', async () => {
    const source = `
    <script setup lang="ts">
      import { $useFun } from './test4'

      $useFun()

    </script>
    `

    const r = await processSetupImports(source, resolvePath)

    expect(r['./test4'].genCode).toMatchInlineSnapshot(`
      "const $useFun = () => {
        $useTT();
      };
      function $useTT() {
        function $useProps() {
          console.log(1);
        }
        $useProps();
        $useOther();
      }
      function $useOther() {}"
    `)
  })
})
