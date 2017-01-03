<template>
  <node :hasActions="true" :nodeData="nodeData">
    <template slot="img">
      <div class="has-text-centered">
        <i v-if="nodeData.properties.intensity" class="fa fa-lightbulb-o " aria-hidden="true" :style="imgDataStyle"></i>
        <img v-else src="../../assets/images/icons/common/unknown.png" alt="" >
      </div>
    </template>

    <template slot="main">
      <div class="has-text-centered">
        <p class="title">
          <template v-if="nodeData.properties.intensity">
            {{ nodeData.properties.intensity.value }} %
          </template>
          <template v-else>
            ?
          </template>
        </p>

        <slider-picker v-model="colors" @change-color="onChange"></slider-picker>
        <input type="range" v-model="intensityInput" min="0" max="100" :data-balloon="`${intensityInput}%`" data-balloon-pos="up" @change="setIntensity()"/>
      </div>
    </template>

    <template slot="footer">

    </template>
  </node>

</template>

<script>
import {mapActions} from 'eva.js'
import {Slider as SliderPicker} from 'vue-color'
import {Component as Node, mixin as nodeMixin} from './Node.js'
import {hslToRgb, rgbToHsl} from '../../helpers/conversions'

export default {
  mixins: [nodeMixin],
  data () {
    const rgb = this.nodeData.properties.color ? this.nodeData.properties.color.value.split(',').map(str => parseInt(str, 10)) : [0, 255, 255]
    const hsl = rgbToHsl(rgb[0], rgb[1], rgb[2])
    hsl[0] *= 360

    return {
      colors: {
        h: hsl[0],
        s: 1,
        l: 0.5,
        a: 1
      },
      intensityInput: this.nodeData.properties.intensity ? this.nodeData.properties.intensity.value : 0
    }
  },
  computed: {
    imgDataStyle () {
      if (this.nodeData.properties.intensity && parseInt(this.nodeData.properties.intensity.value) <= 1) {
        return {
          fontSize: '1725%',
          opacity: 10 / 100,
          color: 'rgb(0,0,0)'
        }
      } else {
        return {
          fontSize: '1725%',
          opacity: this.nodeData.properties.intensity.value / 100,
          color: this.nodeData.properties.color ? `rgb(${parseInt(this.nodeData.properties.color.value.split(',')[0])},${parseInt(this.nodeData.properties.color.value.split(',')[1])},${parseInt(this.nodeData.properties.color.value.split(',')[2])}` : 'rgb(0,0,0)'
        }
      }
    }
  },
  components: {Node, SliderPicker},
  methods: {
    setIntensity () {
      this.setState({
        deviceId: this.nodeData.device.id,
        nodeId: this.nodeData.id,
        property: 'intensity',
        value: this.intensityInput.toString()
      })
    },
    changeColor (rgb) {
      this.setState({
        deviceId: this.nodeData.device.id,
        nodeId: this.nodeData.id,
        property: 'color',
        value: rgb
      })
    },
    onChange (color) {
      const h = parseInt(color.hsl.h, 10) / 360
      const s = 1
      const l = 0.5
      const rgb = hslToRgb(h, s, l)
      console.log(rgb)
      this.changeColor(rgb[0] + ',' + rgb[1] + ',' + rgb[2])
    },
    ...mapActions(['setState'])
  }
}

</script>

<style lang="sass">
  .vue-color__slider
    width: 100% !important

  .vue-color__slider__swatches
    display: none !important
</style>
