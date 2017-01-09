<template>
<div>    
    <canvas  :id="nodeId + '-chart'"></canvas> 

    <div class="has-text-centered">
        <a v-if="interval === 'week'" class="button is-primary">Par Semaine</a>
        <a v-else class="button" @click="changeInterval('week')">Par Semaine</a>
        <a v-if="interval === 'day'" class="button is-primary">Par Jour</a>
        <a v-else class="button" @click="changeInterval('day')">Par Jour</a>
    </div>
</div>

</template>
<script>
import {mapActions} from 'eva.js'
import Chart from "chart.js"

export default {
  props: ['nodeId'],
  data(){
      return {
          interval: "week",
          chart: [],
          nbCanvas: 0,
          types: {
              buzzing: "buzzing",
              color: "color",
              degrees: "degrees",
              intensity: "intensity",
              motion: "motion",
              on: "on",
              open: "open",
              percentage: "percentage"
          }
      }
  },
  methods: {
    async tryRenderTheChart(){
        const result = await this.giveStat()
        
        var tmpResult = this.parseDifferentType(result)
        
        var finalResult = this.parseAllData(tmpResult)
        
        var count = 0


        for(var r in finalResult)
        {
            if(r === 'color') console.log(finalResult[r])
            this.chart[r] = new Chart(this.nodeId + "-chart", {
                type: 'line',
                data: {
                    labels: finalResult[r].labels,
                    datasets: [{
                        label: '# ' + finalResult[r].label,
                        data: finalResult[r].data,
                        backgroundColor: [
                            'rgba(255, 99, 132, 0.2)'
                        ],
                        borderColor: [
                            'rgba(255,99,132,1)'
                        ],
                        borderWidth: 1
                    }]
                }
            });
            count++
        }       
        
        if(count === 0){
            for(var r in this.chart){
                this.chart[r].destroy()
            }
            var canvas = document.getElementById(this.nodeId + '-chart')
            var ctx = canvas.getContext('2d');
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.font = "24.5px Segoe UI"
            ctx.fillText("Pas de statistique !", 10, 50)
        }
    },
    parseDifferentType(result){
        
        var dataReturn = {}

        result.forEach((el) => {
            if(el.node_property_id === this.types.color) return 
            if(dataReturn[el.node_property_id] === undefined) dataReturn[el.node_property_id] = []
            dataReturn[el.node_property_id].push(el)
        })
        this.nbCanvas = Object.keys(dataReturn).length;
        return dataReturn
    },
    parseAllData(tmpResult){
        var data = []

        for(var key in tmpResult) {

            var el = tmpResult[key]

            data[key] = {label: null, labels: [], data: []}

            el.forEach((element)=> {

                if(data[key].label === null){
                    data[key].label = element.node_property_id
                }
                if(this.interval === "day") data[key].labels.push(element.hour + "H")
                else if (this.interval === "week") data[key].labels.push(element.day)

                switch(key){
                    case this.types.buzzing:
                    data[key].data.push(Math.round(element.average))
                    break
                    case this.types.degrees:
                    data[key].data.push(element.average)
                    break
                    case this.types.intensity: 
                    data[key].data.push(Math.round(element.average))
                    break
                    case this.types.motion: 
                    data[key].data.push(Math.round(element.average))
                    case this.types.on:
                    data[key].data.push(Math.round(element.average))
                    break
                    case this.types.open:
                    data[key].data.push(Math.round(element.average))
                    break
                    case this.types.percentage:
                    data[key].data.push(Math.round(element.average))
                    break
                    default:
                        data[key].data.push(element.average)
                    break
                }
            })
        }

        return data
    },
    changeInterval(interval){
        this.interval = interval
        this.tryRenderTheChart()
    },
    async giveStat(){
        const result = await this.giveStatAction({id: this.nodeId, interval: this.interval})
        return result
    },...mapActions({giveStatAction: "giveStat"})
  },
  mounted(){
    this.tryRenderTheChart()
  }
}
</script>

<style lang="sass" scoped>

</style>
