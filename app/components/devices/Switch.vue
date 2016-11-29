<template>
  <card-device>
    <div slot="img">

      <img v-if="state.on && state.on.value === '1'" src="../../assets/images/icons/switch/switch-on.png" alt="" >
      <img v-else-if="state.on && state.on.value === '0'" src="../../assets/images/icons/switch/switch-off.png" alt="" >
      <img v-else src="../../assets/images/icons/common/unknown.png" alt="" >
    </div>
    <div slot="main">

        <button class="button is-danger is-fullwidth" v-if="state.on && state.on.value === '1'" @click="turnSwitch(false)">Éteindre</button>
        <button class="button is-success is-fullwidth" v-else @click="turnSwitch(true)">Allumer</button>
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
    turnSwitch(on){
      this.setState({
        deviceId: this.deviceId,
        nodeId: this.nodeId,
        property: "on",
        value: on ? '1' : '0'
      })
    },
    ...mapActions(["setState"])
  }
}
</script>

<style lang="sass">

</style>
