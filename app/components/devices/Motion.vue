<template>
  <card-device>
    <div slot="img">
      <img v-if="state.motion && state.motion.value === '1'" src="../../assets/images/icons/motion/movement.png" alt="" >
      <img v-else-if="state.motion && state.motion.value === '0'" src="../../assets/images/icons/motion/none.png" alt="" >
      <img v-else src="../../assets/images/icons/common/unknown.png" alt="" >
    </div>
    <div slot="main">
      <div class="has-text-centered">
        <template v-if = "state.motion && state.motion.value === '1'">
        <p class="title">Mouvement détecté</p>
        </template>
        <template v-else-if = "state.motion && state.motion.value === '0'">
          <p class="title">Aucun mouvement</p>
        </template>
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
