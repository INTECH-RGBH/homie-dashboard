<template>
  <node :hasActions="true" :nodeData="nodeData">
    <div slot="img">
      <img v-if="nodeData.properties.buzzing && nodeData.properties.buzzing.value === '1'" src="../../assets/images/icons/buzzer/on.png" alt="" >
      <img v-else-if="nodeData.properties.buzzing && nodeData.properties.buzzing.value === '0'" src="../../assets/images/icons/buzzer/off.png" alt="" >
      <img v-else src="../../assets/images/icons/common/unknown.png" alt="" >
    </div>
    <div slot="main">
      <div class="has-text-centered">
        <p class="title">
          <template v-if="nodeData.properties.buzzing">
            {{ nodeData.properties.buzzing.value === '1' ? 'Actif' : 'Inactif' }}
          </template>
          <template v-else>
            ?
          </template>
        </p>
      </div>
    </div>
    <template slot="footer">
      <a href="" class="card-footer-item" v-if="nodeData.properties.buzzing && nodeData.properties.buzzing.value === '1'" @click.prevent="turnBuzzer(false)">Désactiver</a>
      <a href="" class="card-footer-item" v-else @click.prevent="turnBuzzer(true)">Activer</a>
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
    turnBuzzer (on) {
      this.setState({
        deviceId: this.nodeData.device.id,
        nodeId: this.nodeData.id,
        property: 'buzzing',
        value: on ? '1' : '0'
      })
    },
    ...mapActions(['setState'])
  }
}
</script>

<style lang="sass">

</style>
