<template>
  <card-device>
    <div slot="img">
      <img v-if="state.degrees && state.degrees.value === '0'" src="../../assets/images/icons/heater/off.png" alt="" >
      <img v-else-if="state.degrees && state.degrees.value === '10'" src="../../assets/images/icons/heater/anti-freeze.png" alt="" >
      <img v-else-if="state.degrees && state.degrees.value === '15'" src="../../assets/images/icons/heater/night.png" alt="" >
      <img v-else-if="state.degrees && state.degrees.value === '20'" src="../../assets/images/icons/heater/comfort.png" alt="" >
      <img v-else src="../../assets/images/icons/common/unknown.png" alt="" >
    </div>
    <div slot="main">
      <button class="button is-dark" @click="setDegrees('0')">0 °C</button>
      <button class="button is-info" @click="setDegrees('10')">10 °C</button>
      <button class="button is-warning" @click="setDegrees('15')">15 °C</button>
      <button class="button is-danger" @click="setDegrees('20')">20 °C</button>
    </div>
  </card-device>
</template>

<script>
import {mapActions} from 'eva.js'
import CardDevice from "./Card"

export default {
  props: ['state', 'deviceId', 'nodeId'],
  methods: {
    async setDegrees (degrees) {
      await this.setState({
        deviceId: this.deviceId,
        nodeId: this.nodeId,
        property: 'degrees',
        value: degrees
      })
    },
    ...mapActions(['setState'])
  },
  components:{CardDevice}
}
</script>

<style lang="sass">

</style>
