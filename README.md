#### index.ts
```ts 
const $props = defineProps({
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
import { $useArrow, $useFun, $useOther, useNormal } from './index'

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
const $props = defineProps({
  foo: String
})

function $useArrow() {
  $useProps()
}

function $useTT() {
  $useFoo()
}

const $useFun = function () {
  $useProps()
}

// observed
function $useProps() {
  console.log(props.foo)
}

function $useOther() {
  $useProps()
}

function useNormal() {
  console.log('normal')
}

function $useFoo() {
  console.log('foo')
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
import { useNormal } from './index'

const $props = defineProps({
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


