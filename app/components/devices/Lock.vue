<template>
  <card-device :hasActions="true">
    <div slot="img">
      <img v-if = "state.open && state.open.value === '1'" src = "../../assets/images/icons/lock/open.png">
      <img v-else-if = "state.open && state.open.value === '0'" src = "../../assets/images/icons/lock/closed.png" alt ="">
      <img v-else src="../../assets/images/icons/common/unknown.png" alt="" >
    </div>

    <div slot="main">
      <div class="has-text-centered">
        <template v-if = "state.open">
          <p class="title">{{ state.open.value === '1' ? 'Déverrouillé' : 'Verrouillé' }}</p>
        </template>
      </div>
    </div>

    <template slot="footer">
      <a href="" class="card-footer-item" v-if="state.open && state.open.value === '1'" @click.prevent="turnLock(false)">Fermer</a>
      <a href="" class="card-footer-item" v-else @click.prevent="turnLock(true)">Ouvrir</a>
    </template>
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
