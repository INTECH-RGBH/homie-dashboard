<template>
  <card-device :hasActions="true">
    <div slot="img">
      <img v-if="state.degrees && state.degrees.value === '0'" src="../../assets/images/icons/heater/off.png" alt="" >
      <img v-else-if="state.degrees && state.degrees.value === '10'" src="../../assets/images/icons/heater/anti-freeze.png" alt="" >
      <img v-else-if="state.degrees && state.degrees.value === '15'" src="../../assets/images/icons/heater/night.png" alt="" >
      <img v-else-if="state.degrees && state.degrees.value === '20'" src="../../assets/images/icons/heater/comfort.png" alt="" >
      <img v-else src="../../assets/images/icons/common/unknown.png" alt="" >
    </div>

    <div slot="main">
      <div class="has-text-centered">
        <template v-if = "state.degrees">
          <p class="title">{{ state.degrees.value }} °C</p>
        </template>
      </div>
    </div>

    <template slot="footer">
      <a href="" class="card-footer-item" @click.prevent="setDegrees('0')">0°C</a>
      <a href="" class="card-footer-item" @click.prevent="setDegrees('10')">10°C</a>
      <a href="" class="card-footer-item" @click.prevent="setDegrees('15')">15°C</a>
      <a href="" class="card-footer-item" @click.prevent="setDegrees('20')">20°C</a>
    </template>
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
