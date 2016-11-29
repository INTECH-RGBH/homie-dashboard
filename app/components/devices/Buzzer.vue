<template>
  <card-device :hasActions="true">
    <div slot="img">
      <img v-if="state.buzzing && state.buzzing.value === '1'" src="../../assets/images/icons/buzzer/on.png" alt="" >
      <img v-else-if="state.buzzing && state.buzzing.value === '0'" src="../../assets/images/icons/buzzer/off.png" alt="" >
      <img v-else src="../../assets/images/icons/common/unknown.png" alt="" >
    </div>
    <div slot="main">
      <div class="has-text-centered">
        <template v-if = "state.buzzing">
          <p class="title">{{ state.buzzing.value === '1' ? 'Actif' : 'Inactif' }}</p>
        </template>
      </div>
    </div>
    <template slot="footer">
      <a href="" class="card-footer-item" v-if="state.buzzing && state.buzzing.value === '1'" @click.prevent="turnBuzzer(false)">Fermer</a>
      <a href="" class="card-footer-item" v-else @click.prevent="turnBuzzer(true)">Ouvrir</a>
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
    turnBuzzer(on){
      this.setState({
        deviceId: this.deviceId,
        nodeId: this.nodeId,
        property: "buzzing",
        value: on ? '1' : '0'
      })
    },
    ...mapActions(["setState"])
  }
}
</script>

<style lang="sass">

</style>
