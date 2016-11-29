<template>
  <card-device>
    <div slot="img">
      <img src="../../assets/images/icons/luminosity/sensor.png" alt="" >
    </div>
    <div slot="main">
    <div class="has-text-centered">
          <p class="title">{{state.lux ? state.lux.value : ''}} lx</p>
        </div>
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
