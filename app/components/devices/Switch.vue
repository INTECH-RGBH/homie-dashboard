<template>
  <card-device>
    <div slot="img">

      <img v-if="state.on.value === '1'" src="../../assets/images/icons/switch/switch-on.png" alt="" >
      <img v-else-if="state.on.value === '0'" src="../../assets/images/icons/switch/switch-off.png" alt="" >
      <img v-else src="../../assets/images/icons/common/unknown.png" alt="" >
    </div>
    <div slot="main">
        <button @click="turnSwitch">hello</button>
    </div>
  </card-device>
</template>

<script>
import CardDevice from "./Card"
import {mapActions} from "eva.js"

export default {
  props: ['state', 'deviceId', 'nodeId'],
  components:{CardDevice},
  methods: {
    turnSwitch(){
      this.setState({
            deviceId: this.deviceId,
            nodeId: this.nodeId,
            property: "on",
            value: (this.state.on.value === '1' ? 0 : 1).toString()})
      console.log(this.state.on.value === '1' ? 0 : 1)
      console.log(this.state.on.value)
    },
    ...mapActions(["setState"])
  }
}
</script>

<style lang="sass">

</style>
