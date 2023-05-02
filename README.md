#### index.ts
```ts 
const props = defineProps({
  foo: String
})

function $useArrow() {
  $useProps()
}

const $useFun = function () {
  $useProps()
}

function $useOther() {
  $useProps()
}

function $useProps() {
  console.log(props.foo)
}

function useNormal() {
  console.log('normal')
}

export {
  useNormal,
  $useOther,
  $useArrow,
  $useFun
}
```

#### App.vue
```vue
<script setup lang="ts">
import { $useArrow, $useFun, $useOther, useNormal } from 'index.ts'

useNormal()
$useOther()
$useArrow()
$useFun()
</script>

<template>
  <div />
</template>
```

## Transform Into

#### index.ts
```ts 
const props = defineProps({
  foo: String
})

function $useArrow() {
  $useProps()
}

const $useFun = function () {
  $useProps()
}

function $useOther() {
  $useProps()
}

function $useProps() {
  console.log(props.foo)
}

function useNormal() {
  console.log('normal')
}

export {
  useNormal,
  $useOther,
  $useArrow,
  $useFun
}
```

#### App.vue
```vue
<script setup lang="ts">
import { useNormal } from 'index.ts'

const props = defineProps({
  foo: String
})

function $useArrow() {
  $useProps()
}

const $useFun = function () {
  $useProps()
}

function $useOther() {
  $useProps()
}

function $useProps() {
  console.log(props.foo)
}

useNormal()
$useOther()
$useArrow()
$useFun()
</script>

<template>
  <div />
</template>
```



