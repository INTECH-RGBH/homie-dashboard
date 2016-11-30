<template>
  <card-device :hasActions="true">
    <div slot="img">
      <img v-if="state.percentage && parseInt(state.percentage.value) === 0" src="../../assets/images/icons/shutters/0.png" alt="" >
      <img v-else-if="state.percentage && parseInt(state.percentage.value) > 0 && parseInt(state.percentage.value) <= 10" src="../../assets/images/icons/shutters/10.png" alt="" >
      <img v-else-if="state.percentage && parseInt(state.percentage.value) > 10 && parseInt(state.percentage.value) <= 20" src="../../assets/images/icons/shutters/20.png" alt="" >
      <img v-else-if="state.percentage && parseInt(state.percentage.value) > 20 && parseInt(state.percentage.value) <= 30" src="../../assets/images/icons/shutters/30.png" alt="" >
      <img v-else-if="state.percentage && parseInt(state.percentage.value) > 30 && parseInt(state.percentage.value) <= 40" src="../../assets/images/icons/shutters/40.png" alt="" >
      <img v-else-if="state.percentage && parseInt(state.percentage.value) > 40 && parseInt(state.percentage.value) <= 50" src="../../assets/images/icons/shutters/50.png" alt="" >
      <img v-else-if="state.percentage && parseInt(state.percentage.value) > 50 && parseInt(state.percentage.value) <= 60" src="../../assets/images/icons/shutters/60.png" alt="" >
      <img v-else-if="state.percentage && parseInt(state.percentage.value) > 60 && parseInt(state.percentage.value) <= 70" src="../../assets/images/icons/shutters/70.png" alt="" >
      <img v-else-if="state.percentage && parseInt(state.percentage.value) > 70 && parseInt(state.percentage.value) <= 80" src="../../assets/images/icons/shutters/80.png" alt="" >
      <img v-else-if="state.percentage && parseInt(state.percentage.value) > 80 && parseInt(state.percentage.value) <= 90" src="../../assets/images/icons/shutters/90.png" alt="" >
      <img v-else-if="state.percentage && parseInt(state.percentage.value) > 90 && parseInt(state.percentage.value) <= 100" src="../../assets/images/icons/shutters/100.png" alt="" >
      <img v-else src="../../assets/images/icons/common/unknown.png" alt="" >
    </div>
    <template slot="main">
      <div class="has-text-centered">
        <p class="title">
          <template v-if="state.percentage">
                {{ state.percentage.value }} %
          </template>
          <template v-else>
                ?
          </template>
        </p>
        <input type='range' v-model="rangeValue"  min='0' max='100' @change="setIntensity()"/>
      </div>
      
    </template>
    
  </card-device>
</template>

<script>
import CardDevice from './Card'
import {mapActions} from 'eva.js'

export default {
  data(){
    return {
      rangeValue: this.state.percentage ? this.state.percentage.value : 0
    }
  },
  props: ['state', 'deviceId', 'nodeId'],

  components: {CardDevice},
  methods: {
    setIntensity () {
      this.setState({
        deviceId: this.deviceId,
        nodeId: this.nodeId,
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
