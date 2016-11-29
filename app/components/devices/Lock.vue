<template>
  <card-device>
    <div slot="img">
      <img v-if = "state.open === undefined" src = "../../assets/images/icons/common/unknown.png">
      <img v-else-if = "state.open.value === '1'" src = "../../assets/images/icons/door/door-open.png" alt ="">
      <img v-else src="../../assets/images/icons/door/door-close.png" alt="" >
    </div>
    <div v-if = "state.open !== undefined" slot="main">
      {{state.open.value}}
       <button v-on:click="turnLock()">Modify</button>
    </div>
    <div v-else slot = "main">
      <button v-on:click="turnLock()">Modify</button>
    </div>
    
  </card-device>
</template>

<script>
import CardDevice from "./Card"
import {mapActions} from "eva.js"

export default {
  props: ['state', 'deviceId', 'nodeId'],

  components:{CardDevice},

  methods : {
    async turnLock() {
      try{
       await this.setState({
            deviceId: this.deviceId,
            nodeId: this.nodeId,
            property: "open",
            value: this.state.open.value === "1" ? "0" : "1"})
      }
      catch (e) {console.log("nique")}
    },
    ...mapActions(["setState"])
  }
  
}
</script>

<style lang="sass">

</style>
