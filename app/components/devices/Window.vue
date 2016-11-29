<template>
  <card-device>
    <div slot="img">
      <img v-if="state.open && parseInt(state.open.value) === 1" src="../../assets/images/icons/window/window-open.png" alt="" >
      <img v-else-if="state.open && parseInt(state.open.value) === 0" src="../../assets/images/icons/window/window-close.png" alt="" >
      <img v-else src="../../assets/images/icons/common/unknown.png" alt="" >
    </div>
    <div slot="main">
    </div>
  </card-device>
</template>

<script>
import CardDevice from "./Card"

export default {
  props: ['state', 'deviceId', 'nodeId'],

  components:{CardDevice}
}
</script>

<style lang="sass">

</style>
