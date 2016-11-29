<template>
  <card-device>
    <div slot="img">
      <img src="../../assets/images/icons/sound/wave.png" alt="" >
    </div>
    <div slot="main">
      {{state.intensity ? state.intensity.value : ''}} dB
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
