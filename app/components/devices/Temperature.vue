<template>
  <card-device>
    <div slot="img">
      <img src="../../assets/images/icons/temperature/thermometer.png" alt="" >
    </div>
    <div slot="main">
      {{state.degrees.value}} 
    </div>
  </card-device>
</template>

<script>
import CardDevice from "./Card"
import {mapActions} from "eva.js"

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
