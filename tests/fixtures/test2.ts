const $props = defineProps({
  foo: String,
})

function $useFun() {
  console.log($props.foo)
}

function useNormal() {
  console.log('normal')
}

function $useFoo() {
  console.log(1)
}

export {
  $useFun,
}
