import { bookshelf } from './database'

export default class Statistical {
    constructor(opts)
    {
        this.opts = opts
        this.knex = bookshelf.knex
    }
    

    async getStatDevice(id, interval){
        switch(interval){
            case "day":

            var actualDate = new Date()

            actualDate = (actualDate.getFullYear() + "-" + ("0" + (actualDate.getMonth()+1)).substr(actualDate.getMonth().toString().length - 1) 
                                + "-" + ("0" + actualDate.getDate()).substr(actualDate.getDate().toString().length - 1) ) 
                                
            var result = await this.knex.select(this.knex.raw("DATE(property_history.date/1000, 'unixepoch') as day"),
                                                this.knex.raw("strftime('%H', datetime(property_history.date / 1000, 'unixepoch')) as hour"),
                                                this.knex.raw("property_history.property_id as property_id"),
                                                this.knex.raw("properties.node_property_id"),
                                                this.knex.raw("MIN(CAST(property_history.value AS NUMERIC)) AS minimum"),
                                                //this.knex.raw("CASE WHEN properties.node_property_id = 'color' THEN (avg(CAST(substr( property_history.value , ',', 1 ) AS NUMERIC))  + ',' +  avg(CAST(substr(substr(property_history.value , ',', 2 ),',',-1) AS NUMERIC)) + ',' + avg(CAST(substr(property_history.value , ',', -1 ) AS NUMERIC))) ELSE avg(CAST(property_history.value AS NUMERIC)) END AS average"),
                                                this.knex.raw("avg(CAST(property_history.value AS NUMERIC)) AS average"),
                                                this.knex.raw("MAX(CAST(property_history.value AS NUMERIC)) AS maximum"))
                                            .from("property_history").join("properties", "property_history.property_id", "properties.id").join("nodes", "properties.node_id", "nodes.id")
                                            .where("nodes.device_node_id", id)
                                            .where('day', actualDate)
                                            .groupBy("day", "hour", "property_id")
                                            .orderBy("day", "hour", 'ASC')
            return result     
            break

            case "week":

            var dateInterval = []
            var actualDate = new Date()
            var lastDate = new Date(actualDate.getTime() - (86400000 * 7))

            dateInterval.push(lastDate.getFullYear() + "-" + ("0" + (lastDate.getMonth()+1)).substr(lastDate.getMonth().toString().length - 1 ) 
                                + "-" + ("0" + lastDate.getDate()).substr(lastDate.getDate().toString().length - 1 ) ) 
            dateInterval.push(actualDate.getFullYear() + "-" + ("0" + (actualDate.getMonth()+1)).substr(actualDate.getMonth().toString().length - 1) 
                                + "-" + ("0" + actualDate.getDate()).substr(actualDate.getDate().toString().length - 1) ) 

            var result = await this.knex.select(this.knex.raw("DATE(property_history.date/1000, 'unixepoch') as day"),
                                                this.knex.raw("property_history.property_id as property_id"),
                                                this.knex.raw("properties.node_property_id"),
                                                this.knex.raw("MIN(CAST(property_history.value AS NUMERIC)) AS minimum"),
                                                this.knex.raw("avg(CAST(property_history.value AS NUMERIC)) AS average"),
                                                this.knex.raw("MAX(CAST(property_history.value AS NUMERIC)) AS maximum"))
                                            .from("property_history").join("properties", "property_history.property_id", "properties.id").join("nodes", "properties.node_id", "nodes.id")
                                            .where("nodes.device_node_id", id)
                                            .whereBetween('day', dateInterval)
                                            .groupBy("day","property_id")
                                            .orderBy("day", 'ASC')
            return result
            break

            default:
            return {}
            break 
        }

    }

}
