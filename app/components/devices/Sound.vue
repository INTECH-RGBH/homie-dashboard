<template>
  <node :nodeData="nodeData">
    <div slot="img">
      <img src="../../assets/images/icons/sound/wave.png" alt="" >
    </div>
    <div slot="main">
      <div class="has-text-centered">
        <p class="title">
          <template v-if="nodeData.properties.intensity">
            {{ nodeData.properties.intensity.value }} dB
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
