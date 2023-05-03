const $props = defineProps(['foo'])

function $useTT() {
  $useProps()
}

function $useOther() {
  $useTT()
}

function $useProps() {
  console.log($props.foo)
}

export {
  $useOther,
}
