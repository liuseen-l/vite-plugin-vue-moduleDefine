#### index.ts
```ts 
const props = defineProps({
  foo: String
})

function useOther() {
  useProps()
}

function useProps() {
  console.log(props.foo)
}

function useNormal() {
  console.log('normal')
}

export {
  useNormal,
  useOther
}
```

#### App.vue
```vue
<script setup lang="ts">
import { useNormal, useOther } from 'index.ts'

useNormal()
useOther()
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

function useOther() {
  useProps()
}

function useProps() {
  console.log(props.foo)
}

function useNormal() {
  console.log('normal')
}

export {
  useNormal,
  useOther
}
```

#### App.vue
```vue
<script setup lang="ts">
import { useNormal } from 'index.ts'

const props = defineProps({
  foo: String
})

function useOther() {
  useProps()
}

function useProps() {
  console.log(props.foo)
}

useNormal()
useOther()
</script>

<template>
  <div />
</template>
```



