<template>
  <card-device>
    <div slot="img">
      <img src="../../assets/images/icons/temperature/thermometer.png" alt="" >
      <!--<canvas ref="canvas"></canvas>-->
    </div>
    <div slot="main">
     <div class="has-text-centered">
          <p class="title">{{state.degrees ? state.degrees.value : ''}} °C</p>
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
