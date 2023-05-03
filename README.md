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

<<<<<<< HEAD
function $useTT() {
  $useFoo()
}

=======
>>>>>>> 34befb7658b4f45777b93a8aca184babc1a1a2fa
const $useFun = function () {
  $useProps()
}

<<<<<<< HEAD
// observed
=======
function $useOther() {
  $useProps()
}

>>>>>>> 34befb7658b4f45777b93a8aca184babc1a1a2fa
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


