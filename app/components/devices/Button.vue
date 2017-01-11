<template>
  <node :nodeData="nodeData">
    <div slot="img">
      <img v-if="nodeData.properties.pressed && nodeData.properties.pressed.value === '1'" src="../../assets/images/icons/button/pressed.png" alt="" >
      <img v-else-if="nodeData.properties.pressed && nodeData.properties.pressed.value === '0'" src="../../assets/images/icons/button/released.png" alt="" >
      <img v-else src="../../assets/images/icons/common/unknown.png" alt="" >
    </div>
    <div slot="main">
      <div class="has-text-centered">
        <p class="title">
          <template v-if="nodeData.properties.motion">
            {{ nodeData.properties.pressed.value === '1' ? 'Pressé' : 'Relâché' }}
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
