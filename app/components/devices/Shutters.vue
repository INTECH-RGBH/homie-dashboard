<template>
  <node :hasActions="true" :nodeData="nodeData">
    <div slot="img">
      <img v-if="nodeData.properties.percentage && parseInt(nodeData.properties.percentage.value) === 0" src="../../assets/images/icons/shutters/0.png" alt="" >
      <img v-else-if="nodeData.properties.percentage && parseInt(nodeData.properties.percentage.value) > 0 && parseInt(nodeData.properties.percentage.value) <= 10" src="../../assets/images/icons/shutters/10.png" alt="" >
      <img v-else-if="nodeData.properties.percentage && parseInt(nodeData.properties.percentage.value) > 10 && parseInt(nodeData.properties.percentage.value) <= 20" src="../../assets/images/icons/shutters/20.png" alt="" >
      <img v-else-if="nodeData.properties.percentage && parseInt(nodeData.properties.percentage.value) > 20 && parseInt(nodeData.properties.percentage.value) <= 30" src="../../assets/images/icons/shutters/30.png" alt="" >
      <img v-else-if="nodeData.properties.percentage && parseInt(nodeData.properties.percentage.value) > 30 && parseInt(nodeData.properties.percentage.value) <= 40" src="../../assets/images/icons/shutters/40.png" alt="" >
      <img v-else-if="nodeData.properties.percentage && parseInt(nodeData.properties.percentage.value) > 40 && parseInt(nodeData.properties.percentage.value) <= 50" src="../../assets/images/icons/shutters/50.png" alt="" >
      <img v-else-if="nodeData.properties.percentage && parseInt(nodeData.properties.percentage.value) > 50 && parseInt(nodeData.properties.percentage.value) <= 60" src="../../assets/images/icons/shutters/60.png" alt="" >
      <img v-else-if="nodeData.properties.percentage && parseInt(nodeData.properties.percentage.value) > 60 && parseInt(nodeData.properties.percentage.value) <= 70" src="../../assets/images/icons/shutters/70.png" alt="" >
      <img v-else-if="nodeData.properties.percentage && parseInt(nodeData.properties.percentage.value) > 70 && parseInt(nodeData.properties.percentage.value) <= 80" src="../../assets/images/icons/shutters/80.png" alt="" >
      <img v-else-if="nodeData.properties.percentage && parseInt(nodeData.properties.percentage.value) > 80 && parseInt(nodeData.properties.percentage.value) <= 90" src="../../assets/images/icons/shutters/90.png" alt="" >
      <img v-else-if="nodeData.properties.percentage && parseInt(nodeData.properties.percentage.value) > 90 && parseInt(nodeData.properties.percentage.value) <= 100" src="../../assets/images/icons/shutters/100.png" alt="" >
      <img v-else src="../../assets/images/icons/common/unknown.png" alt="" >
    </div>
    <template slot="main">
      <div class="has-text-centered">
        <p class="title">
          <template v-if="nodeData.properties.percentage">
                {{ nodeData.properties.percentage.value }} %
          </template>
          <template v-else>
                ?
          </template>
        </p>
        <input type='range' v-model="rangeValue"  min='0' max='100' @change="setIntensity()"/>
      </div>

    </template>

  </node>
</template>

<script>
import {Component as Node, mixin as nodeMixin} from './Node.js'
import {mapActions} from 'eva.js'

export default {
  data () {
    return {
      rangeValue: this.nodeData.properties.percentage ? this.nodeData.properties.percentage.value : 0
    }
  },
  mixins: [nodeMixin],

  components: {Node},
  methods: {
    setIntensity () {
      this.setState({
        deviceId: this.nodeData.device.id,
        nodeId: this.nodeData.id,
        property: 'percentage',
        value: this.rangeValue.toString()
      })
    },
    ...mapActions(['setState'])
  }
}
</script>

<style lang="sass">

</style>
