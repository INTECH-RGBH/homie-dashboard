<template>
  <card-device>
    <div slot="img">
      <img v-if="state.percentage && parseInt(state.percentage.value) === 0" src="../../assets/images/icons/shutters/0.png" alt="" >
      <img v-else-if="state.percentage && parseInt(state.percentage.value) === 10" src="../../assets/images/icons/shutters/10.png" alt="" >
      <img v-else-if="state.percentage && parseInt(state.percentage.value) === 20" src="../../assets/images/icons/shutters/20.png" alt="" >
      <img v-else-if="state.percentage && parseInt(state.percentage.value) === 30" src="../../assets/images/icons/shutters/30.png" alt="" >
      <img v-else-if="state.percentage && parseInt(state.percentage.value) === 40" src="../../assets/images/icons/shutters/40.png" alt="" >
      <img v-else-if="state.percentage && parseInt(state.percentage.value) === 50" src="../../assets/images/icons/shutters/50.png" alt="" >
      <img v-else-if="state.percentage && parseInt(state.percentage.value) === 60" src="../../assets/images/icons/shutters/60.png" alt="" >
      <img v-else-if="state.percentage && parseInt(state.percentage.value) === 70" src="../../assets/images/icons/shutters/70.png" alt="" >
      <img v-else-if="state.percentage && parseInt(state.percentage.value) === 80" src="../../assets/images/icons/shutters/80.png" alt="" >
      <img v-else-if="state.percentage && parseInt(state.percentage.value) === 90" src="../../assets/images/icons/shutters/90.png" alt="" >
      <img v-else-if="state.percentage && parseInt(state.percentage.value) === 100" src="../../assets/images/icons/shutters/100.png" alt="" >
      <img v-else src="../../assets/images/icons/common/unknown.png" alt="" >
    </div>
    <div slot="main">
      <a v-bind:class="[state.percentage && parseInt(state.percentage.value) === 0 ? 'button is-primary' : 'button']" @click="setIntensity(0)">0 %</a>
      <a v-bind:class="[state.percentage && parseInt(state.percentage.value) === 10 ? 'button is-primary' : 'button']" @click="setIntensity(10)">10 %</a>
      <a v-bind:class="[state.percentage && parseInt(state.percentage.value) === 20 ? 'button is-primary' : 'button']" @click="setIntensity(20)">20 %</a>
      <a v-bind:class="[state.percentage && parseInt(state.percentage.value) === 30 ? 'button is-primary' : 'button']" @click="setIntensity(30)">30 %</a>
      <a v-bind:class="[state.percentage && parseInt(state.percentage.value) === 40 ? 'button is-primary' : 'button']" @click="setIntensity(40)">40 %</a>
      <a v-bind:class="[state.percentage && parseInt(state.percentage.value) === 50 ? 'button is-primary' : 'button']" @click="setIntensity(50)">50 %</a>
      <a v-bind:class="[state.percentage && parseInt(state.percentage.value) === 60 ? 'button is-primary' : 'button']" @click="setIntensity(60)">60 %</a>
      <a v-bind:class="[state.percentage && parseInt(state.percentage.value) === 70 ? 'button is-primary' : 'button']" @click="setIntensity(70)">70 %</a>
      <a v-bind:class="[state.percentage && parseInt(state.percentage.value) === 80 ? 'button is-primary' : 'button']" @click="setIntensity(80)">80 %</a>
      <a v-bind:class="[state.percentage && parseInt(state.percentage.value) === 90 ? 'button is-primary' : 'button']" @click="setIntensity(90)">90 %</a>
      <a v-bind:class="[state.percentage && parseInt(state.percentage.value) === 100 ? 'button is-primary' : 'button']" @click="setIntensity(100)">100 %</a>
    </div>
  </card-device>
</template>

<script>
import CardDevice from "./Card"
import {mapActions} from "eva.js"

export default {
  props: ['state', 'deviceId', 'nodeId'],

  components:{CardDevice},
  methods: {
    setIntensity(percentage){
      this.setState({
        deviceId: this.deviceId,
        nodeId: this.nodeId,
        property: "percentage",
        value: percentage.toString()
      })
    },...mapActions(["setState"])
  }
}
</script>

<style lang="sass">

</style>
