<template>
  <node :hasActions="true" :nodeData="nodeData">
    <div slot="img">
      <img v-if = "nodeData.properties.open && nodeData.properties.open.value === '1'" src = "../../assets/images/icons/lock/open.png">
      <img v-else-if = "nodeData.properties.open && nodeData.properties.open.value === '0'" src = "../../assets/images/icons/lock/closed.png" alt ="">
      <img v-else src="../../assets/images/icons/common/unknown.png" alt="" >
    </div>

    <div slot="main">
      <div class="has-text-centered">
        <p class="title">
          <template v-if="nodeData.properties.open">
            {{ nodeData.properties.open.value === '1' ? 'Déverrouillé' : 'Verrouillé' }}
          </template>
          <template v-else>
            ?
          </template>
        </p>
      </div>
    </div>

    <template slot="footer">
      <a href="" class="card-footer-item" v-if="nodeData.properties.open && nodeData.properties.open.value === '1'" @click.prevent="turnLock(false)">Fermer</a>
      <a href="" class="card-footer-item" v-else @click.prevent="turnLock(true)">Ouvrir</a>
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
    async turnLock (open) {
      await this.setState({
        deviceId: this.nodeData.device.id,
        nodeId: this.nodeData.id,
        property: 'open',
        value: open ? '1' : '0'
      })
    },
    ...mapActions(['setState'])
  }
}
</script>

<style lang="sass">

</style>
