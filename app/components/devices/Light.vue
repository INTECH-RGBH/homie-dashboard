<template>
  <card-device :hasActions="true">
    <div slot="img">

      <img v-if="state.intensity && parseInt(state.intensity.value) > 0" src="../../assets/images/icons/light/on.png" alt="" v-bind:style="{opacity:state.intensity.value / 100}">
      <img v-else-if="state.intensity && parseInt(state.intensity.value) === 0 " src="../../assets/images/icons/light/off.png" alt="">

      <img v-else src="../../assets/images/icons/common/unknown.png" alt="" >
    </div>
    <div slot="main">
      <div class="has-text-centered">
      <p>
        <button v-if="state.color" class="button is-fullwidth" v-bind:style="rgbVar">Couleur Actuelle</button>
        <button v-else class="button is-fullwidth">Couleur non définie</button>
        <br>
        <a class="button " style="background-color:rgb(255,0,127)" @click="changeColor('255,0,127')"> > </a>
        <a class="button "style="background-color:rgb(255,255,0)" @click="changeColor('255,255,0')"> > </a>
        <a class="button "style="background-color:rgb(255,255,255)" @click="changeColor('255,255,255')"> > </a>
      </p>
       <p>

       </p> 
        <input type='range' v-model="rangeValue"  min='0' max='100' @change="setIntensity()"/>
      </div>
    </div>
  </card-device>
</template>

<script>
import CardDevice from './Card'
import {mapActions} from 'eva.js'

export default {
  data(){
    return {
      rangeValue: this.state.intensity ? this.state.intensity.value : 0
    }
  },
  computed: {
    rgbVar () {
      return {
        backgroundColor: `rgb(${parseInt(this.state.color.value.split(',')[0])},${parseInt(this.state.color.value.split(',')[1])},${parseInt(this.state.color.value.split(',')[2])}`
      }
    },
    styleRedBackground() {
      return {
        backgroundColor: '#e74c3c',
        color: "black"
      }
    }
  },
  props: ['state', 'deviceId', 'nodeId'],
  components: {CardDevice},
  methods: {
    setIntensity () {
      this.setState({
        deviceId: this.deviceId,
        nodeId: this.nodeId,
        property: 'intensity',
        value: this.rangeValue.toString()
      })
    },
    ...mapActions(['setState']),
    changeColor (rgb) {
      this.setState({
        deviceId: this.deviceId,
        nodeId: this.nodeId,
        property: 'color',
        value: rgb
      })
    },
    ...mapActions(['setState'])
  }
}
</script>

<style lang="sass">

</style>
