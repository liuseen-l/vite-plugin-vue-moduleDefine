## index.ts
```ts 
const props = defineProps({
  foo: String
})

function useProps() {
  console.log(props.foo)
}

function useNormal() {
  console.log('normal')
}

export {
  useProps,
  useNormal
}
```

## App.vue
```vue
<script setup lang="ts">
import { useNormal, useProps } from 'index.ts'

useNormal()
useProps()
</script>

<template>
  <div />
</template>
```

# Transform Into

## index.ts
```ts 
function useNormal() {
  console.log('normal')
}

export {
  useNormal
}
```

## App.vue
```vue
<script setup lang="ts">
import { useNormal } from 'index.ts'

const props = defineProps({
  foo: String
})

function useProps() {
  console.log(props.foo)
}

useNormal()
useProps()
</script>

<template>
  <div />
</template>
```



