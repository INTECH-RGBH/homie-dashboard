<template>
  <card-device>
    <div slot="img">

      <img v-if="state.on.value === '1'" src="../../assets/images/icons/switch/switch-on.png" alt="" >
      <img v-else-if="state.on.value === '0'" src="../../assets/images/icons/switch/switch-off.png" alt="" >
      <img v-else src="../../assets/images/icons/common/unknown.png" alt="" >
    </div>
    <div slot="main">

        <button class="button is-success is-fullwidth" v-if="state.on.value === '1'" @click="turnSwitch">Allumer</button>
        <button class="button is-danger is-fullwidth" v-else-if="state.on.value === '0'" @click="turnSwitch">Eteindre</button>
        <button class="button is-info is-fullwidth" v-else @click="turnSwitch">Define State</button>
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
    },
    ...mapActions(["setState"])
  }
}
</script>

<style lang="sass">

</style>
