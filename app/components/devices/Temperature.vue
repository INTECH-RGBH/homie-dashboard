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

export default {
  props: ['state', 'deviceId', 'nodeId', ],

  components:{CardDevice},

  methods:{
    changeTemp(){
      this.setState({
            deviceId: this.deviceId,
            nodeId: this.nodeId,
            property: "",
            value: "1"})
    },
    ...mapActions(["setState"])
  }
}
</script>

<style lang="sass">

</style>
