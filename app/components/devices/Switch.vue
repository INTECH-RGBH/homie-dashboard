<template>
  <node :hasActions="true" :nodeData="nodeData">
    <div slot="img">
      <img v-if="nodeData.properties.on && nodeData.properties.on.value === '1'" src="../../assets/images/icons/switch/switch-on.png" alt="" >
      <img v-else-if="nodeData.properties.on && nodeData.properties.on.value === '0'" src="../../assets/images/icons/switch/switch-off.png" alt="" >
      <img v-else src="../../assets/images/icons/common/unknown.png" alt="" >
    </div>
    <div slot="main">
      <div class="has-text-centered">
        <p class="title">
          <template v-if="nodeData.properties.on">
            {{ nodeData.properties.on.value === '1' ? 'ON' : 'OFF' }}
          </template>
          <template v-else>
            ?
          </template>
        </p>
      </div>
    </div>
    <template slot="footer">
      <a href="" class="card-footer-item" v-if="nodeData.properties.on && nodeData.properties.on.value === '1'" @click.prevent="turnSwitch(false)">OFF</a>
      <a href="" class="card-footer-item" v-else @click.prevent="turnSwitch(true)">ON</a>
    </template>
  </node>
</template>

<script>
import {Component as Node, mixin as nodeMixin} from './Node.js'
import {mapActions} from 'eva.js'

export default {
  mixins: [nodeMixin],
  components: {Node},
  methods: {
    turnSwitch (on) {
      this.setState({
        deviceId: this.nodeData.device.id,
        nodeId: this.nodeData.id,
        property: 'on',
        value: on ? '1' : '0'
      })
    },
    ...mapActions(['setState'])
  }
}
</script>

<style lang="sass">

</style>
