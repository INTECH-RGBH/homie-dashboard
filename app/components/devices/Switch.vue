<template>
  <card-device :hasActions="true">
    <div slot="img">
      <img v-if="state.on && state.on.value === '1'" src="../../assets/images/icons/switch/switch-on.png" alt="" >
      <img v-else-if="state.on && state.on.value === '0'" src="../../assets/images/icons/switch/switch-off.png" alt="" >
      <img v-else src="../../assets/images/icons/common/unknown.png" alt="" >
    </div>
    <div slot="main">
      <div class="has-text-centered">
        <template v-if = "state.on">
          <p class="title">{{ state.on.value === '1' ? 'ON' : 'OFF' }}</p>
        </template>
      </div>
    </div>
    <template slot="footer">
      <a href="" class="card-footer-item" v-if="state.on && state.on.value === '1'" @click.prevent="turnSwitch(false)">OFF</a>
      <a href="" class="card-footer-item" v-else @click.prevent="turnSwitch(true)">ON</a>
    </template>
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
