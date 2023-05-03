const $props = defineProps(['foo'])

function $useArrow() {
  return 1
}

function $useTT() {

}

const $useFun = () => {
  // $useTT()
  $useProps($useArrow())
}

function $useProps(a) {
  console.log($props.foo)
}

export {
  $useFun,
}
