<template>
  <card-device>
    <div slot="img">
      <img src="../../assets/images/icons/humidity/drop.png" alt="" >
    </div>
    <div slot="main">
      <div class="has-text-centered">
          <p v-if="state.percentage" class="title">{{state.percentage.value}} %</p>
      </div>
    </div>
  </card-device>
</template>

<script>
import CardDevice from "./Card"

export default {
  props: ['state', 'deviceId', 'nodeId'],

  components:{CardDevice}
}
</script>

<style lang="sass">

</style>
