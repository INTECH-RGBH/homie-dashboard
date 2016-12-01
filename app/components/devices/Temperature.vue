<template>
  <node :nodeData="nodeData">
    <div slot="img">
      <img src="../../assets/images/icons/temperature/thermometer.png" alt="" >
      <!--<canvas ref="canvas"></canvas>-->
    </div>
    <div slot="main">
      <div class="has-text-centered">
        <p class="title">
          <template v-if="this.nodeData.properties.degrees">
            {{ this.nodeData.properties.degrees.value }} °C
          </template>
          <template v-else>
            ?
          </template>
        </p>
      </div>
    </div>
  </node>
</template>

<script>
import {Component as Node, mixin as nodeMixin} from './Node.js'

export default {
  mixins: [nodeMixin],

  components: {Node}
}
</script>

<style lang="sass">

</style>
