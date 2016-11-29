<template>
  <card-device>
    <div slot="img">
      <img src="../../assets/images/icons/humidity/drop.png" alt="" >
    </div>
    <div slot="main">
      <p v-if="state.percentage">{{state.percentage.value}} %</p>
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
