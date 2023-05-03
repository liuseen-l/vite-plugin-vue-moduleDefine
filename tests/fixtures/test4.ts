const props = defineProps({
  foo: String,
})

function $useArrow() {
}

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
  console.log(props.foo)
}

function useNormal() {
  console.log('normal')
}

export {
  useNormal,
  $useOther,
  $useArrow,
  $useFun,
}
