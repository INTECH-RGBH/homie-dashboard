<template>
  <card-device>
    <div slot="img">
      <img src="../../assets/images/icons/temperature/thermometer.png" alt="" >
      <!--<canvas ref="canvas"></canvas>-->
    </div>
    <div slot="main">
      {{state.degrees ? state.degrees.value : ''}} °C
    </div>
  </card-device>
</template>

<script>
import CardDevice from "./Card"
import {mapActions} from "eva.js"

export default {
  props: ['state', 'deviceId', 'nodeId', ],

  components:{CardDevice},

   mounted(){
    //const canvas = this.$refs.canvas.getContext("2d")
    
  }
}
</script>

<style lang="sass">

</style>
