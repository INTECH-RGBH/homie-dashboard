<template>
  <card-device>
    <div slot="img">
      <img src="../../assets/images/icons/temperature/thermometer.png" alt="" >
      <canvas ref="canvas"></canvas>
    </div>
    <div slot="main">
      {{state.degrees.value}} 
    </div>
  </card-device>
</template>

<script>
import CardDevice from "./Card"
import {mapActions} from "eva.js"

export default {
  props: ['state', 'deviceId', 'nodeId', ],

  components:{CardDevice},

  methods:{
    changeTemp(){
      this.setState({
            deviceId: this.deviceId,
            nodeId: this.nodeId,
            property: "",
            value: "1"})
    },
    ...mapActions(["setState"])
  },
   mounted(){
    const canvas = this.$refs.canvas.getContext("2d")
    console.log(canvas)
    canvas.beginPath();//On démarre un nouveau tracé
    canvas.moveTo(0, 300);//On se déplace au coin inférieur gauche
    canvas.lineTo(150, 0);
    canvas.lineTo(300, 300);
    canvas.lineTo(0, 300);
    canvas.stroke();//On trace seulement les lignes.
    canvas.closePath();
  }
}
</script>

<style lang="sass">

</style>
