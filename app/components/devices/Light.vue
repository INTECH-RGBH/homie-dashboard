<template>
  <card-device>
    <div slot="img">
      <img v-if="state.on && state.on.value === '1'" src="../../assets/images/icons/light/on.png" alt="" >
      <img v-else-if="state.on && state.on.value === '0'" src="../../assets/images/icons/light/off.png" alt="" >
      <img v-else src="../../assets/images/icons/common/unknown.png" alt="" >
    </div>
    <div slot="main">
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
