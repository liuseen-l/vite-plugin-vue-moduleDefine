const $props = defineProps(['foo'])

function $useArrow() {
}

function $useTT() {
  $useProps()
}

const $useFun = () => {
  $useTT()
}

function $useProps() {
  console.log($props.foo)
}

export {
  $useArrow,
  $useFun,
}
