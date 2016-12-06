<template>
  <node :hasActions="true" :nodeData="nodeData">
    <div slot="img">
      <img v-if="nodeData.properties.degrees && nodeData.properties.degrees.value === '0'" src="../../assets/images/icons/heater/off.png" alt="" >
      <img v-else-if="nodeData.properties.degrees && nodeData.properties.degrees.value === '10'" src="../../assets/images/icons/heater/anti-freeze.png" alt="" >
      <img v-else-if="nodeData.properties.degrees && nodeData.properties.degrees.value === '15'" src="../../assets/images/icons/heater/night.png" alt="" >
      <img v-else-if="nodeData.properties.degrees && nodeData.properties.degrees.value === '20'" src="../../assets/images/icons/heater/comfort.png" alt="" >
      <img v-else src="../../assets/images/icons/common/unknown.png" alt="" >
    </div>

    <div slot="main">
      <div class="has-text-centered">
        <p class="title">
          <template v-if="nodeData.properties.degrees">
            {{ nodeData.properties.degrees.value }} °C
          </template>
          <template v-else>
            ?
          </template>
        </p>
      </div>
    </div>

    <template slot="footer">
      <a href="" class="card-footer-item" @click.prevent="setDegrees('0')" v-bind:style="[nodeData.properties.degrees && nodeData.properties.degrees.value === '0' ? styleRedBackground : '']">0°C</a>
      <a href="" class="card-footer-item" @click.prevent="setDegrees('10')" v-bind:style="[nodeData.properties.degrees && nodeData.properties.degrees.value === '10' ? styleRedBackground : '']">10°C</a>
      <a href="" class="card-footer-item" @click.prevent="setDegrees('15')" v-bind:style="[nodeData.properties.degrees && nodeData.properties.degrees.value === '15' ? styleRedBackground : '']">15°C</a>
      <a href="" class="card-footer-item" @click.prevent="setDegrees('20')" v-bind:style="[nodeData.properties.degrees && nodeData.properties.degrees.value === '20' ? styleRedBackground : '']">20°C</a>
    </template>
  </node>
</template>

<script>
import {mapActions} from 'eva.js'
import {Component as Node, mixin as nodeMixin} from './Node.js'

export default {
  mixins: [nodeMixin],
  computed: {
    styleRedBackground () {
      return {
        backgroundColor: '#e74c3c',
        color: '#fff'
      }
    }
  },
  methods: {
    async setDegrees (degrees) {
      await this.setState({
        deviceId: this.nodeData.device.id,
        nodeId: this.nodeData.id,
        property: 'degrees',
        value: degrees
      })
    },
    ...mapActions(['setState'])
  },
  components: {Node}
}
</script>

<style lang="sass">

</style>
