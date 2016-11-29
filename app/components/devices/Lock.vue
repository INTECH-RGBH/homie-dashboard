<template>
  <card-device>
    <div slot="img">
      <img v-if = "state.open && state.open.value === '1'" src = "../../assets/images/icons/lock/open.png">
      <img v-else-if = "state.open && state.open.value === '0'" src = "../../assets/images/icons/lock/closed.png" alt ="">
      <img v-else src="../../assets/images/icons/common/unknown.png" alt="" >
    </div>
    <div slot="main">
      <button class="button is-danger is-fullwidth" v-if="state.open && state.open.value === '1'" @click="turnLock(false)">Fermer</button>
        <button class="button is-success is-fullwidth" v-else @click="turnLock(true)">Ouvrir</button>
    </div>
  </card-device>
</template>

<script>
import CardDevice from "./Card"
import {mapActions} from "eva.js"

export default {
  props: ['state', 'deviceId', 'nodeId'],

  components:{CardDevice},

  methods : {
    async turnLock(open) {
       await this.setState({
            deviceId: this.deviceId,
            nodeId: this.nodeId,
            property: "open",
             value: open ? '1' : '0'})
    },
    ...mapActions(["setState"])
  }
}
</script>

<style lang="sass">

</style>
