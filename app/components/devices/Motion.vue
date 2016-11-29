<template>
  <card-device>
    <div slot="img">
      <img v-if="state.motion && state.motion.value === '1'" src="../../assets/images/icons/motion/movement.png" alt="" >
      <img v-else-if="state.motion && state.motion.value === '0'" src="../../assets/images/icons/motion/none.png" alt="" >
      <img v-else src="../../assets/images/icons/common/unknown.png" alt="" >
    </div>
    <div slot="main">
      <template v-if = "state.motion && state.motion.value === '1'">
      Mouvement détecté
      </template>
      <template v-else-if = "state.motion && state.motion.value === '0'">
        Aucun Mouvement
      </template>
      <template v-else>
      </template>
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
