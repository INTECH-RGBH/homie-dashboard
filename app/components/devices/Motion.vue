<template>
  <card-device>
    <div slot="img">
      <img src="../../assets/images/icons/shutters/0.png" alt="" >
    </div>
    <div slot="main">
      {{state.motion.value}}
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
