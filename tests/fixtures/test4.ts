const $props = defineProps(['foo'])

function $useTT() {
  function $useProps() {
    console.log(1)
  }
  $useProps()
  $useOther()
}

const $useFun = () => {
  $useTT()
}

function $useOther() {

}

function $useProps() {
  console.log($props.foo)
}

export {
  $useFun,
}
