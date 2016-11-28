<template>
  <card-device>
    <div slot="img">
      <img src="../../assets/images/icons/door/door-open.png" alt="" >
    </div>
    <div slot="main">
      {{state.degrees.value}}
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
