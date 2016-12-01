<template>
  <node :nodeData="nodeData">
    <div slot="img">
      <img src="../../assets/images/icons/humidity/drop.png" alt="" >
    </div>
    <div slot="main">
      <div class="has-text-centered">
        <p class="title">
          <template v-if="nodeData.properties.percentage">
            {{ nodeData.properties.percentage.value }} %
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
