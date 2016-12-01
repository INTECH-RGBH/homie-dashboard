<template>
  <node :hasActions="true" :nodeData="nodeData">
    <div slot="img">

      <img v-if="nodeData.properties.intensity && parseInt(nodeData.properties.intensity.value) > 0" src="../../assets/images/icons/light/on.png" alt="" v-bind:style="{opacity:nodeData.properties.intensity.value / 100}">
      <img v-else-if="nodeData.properties.intensity && parseInt(nodeData.properties.intensity.value) === 0 " src="../../assets/images/icons/light/off.png" alt="">

      <img v-else src="../../assets/images/icons/common/unknown.png" alt="" >
    </div>
    <div slot="main">
      <div class="has-text-centered">
      <p>
        <button v-if="nodeData.properties.color" class="button is-fullwidth" v-bind:style="rgbVar">Couleur Actuelle</button>
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
  </node>
</template>

<script>
import {Component as Node, mixin as nodeMixin} from './Node.js'
import {mapActions} from 'eva.js'

export default {
  mixins: [nodeMixin],
  data () {
    return {
      rangeValue: this.nodeData.properties.intensity ? this.nodeData.properties.intensity.value : 0
    }
  },
  computed: {
    rgbVar () {
      return {
        backgroundColor: `rgb(${parseInt(this.nodeData.properties.color.value.split(',')[0])},${parseInt(this.nodeData.properties.color.value.split(',')[1])},${parseInt(this.nodeData.properties.color.value.split(',')[2])}`
      }
    },
    styleRedBackground () {
      return {
        backgroundColor: '#e74c3c',
        color: 'black'
      }
    }
  },
  components: {Node},
  methods: {
    setIntensity () {
      this.setState({
        deviceId: this.nodeData.device.id,
        nodeId: this.nodeData.id,
        property: 'intensity',
        value: this.rangeValue.toString()
      })
    },
    ...mapActions(['setState']),
    changeColor (rgb) {
      this.setState({
        deviceId: this.nodeData.device.id,
        nodeId: this.nodeData.id,
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
