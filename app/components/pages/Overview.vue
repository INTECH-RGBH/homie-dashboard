<template>
  <div>
    <div class="modal" :class="{ 'is-active': addFloorOpened }">
      <div class="modal-background"></div>
      <div class="modal-card">
        <header class="modal-card-head">
          <p class="modal-card-title">Ajouter un étage</p>
          <button @click.prevent="addFloorOpened = false" class="delete"></button>
        </header>
        <section class="modal-card-body">
          <div class="content">
            <label class="label">Nom de l'étage</label>
            <p class="control">
              <input v-model="floorNameInput" class="input" type="text" placeholder="Premier étage">
            </p>
          </div>
        </section>
        <footer class="modal-card-foot">
          <a @click="addFloor" class="button is-primary">Ajouter</a>
        </footer>
      </div>
    </div>

     <div class="modal" :class="{ 'is-active': addRoomOpened }">
      <div class="modal-background"></div>
      <div class="modal-card">
        <header class="modal-card-head">
          <p class="modal-card-title">Ajouter une salle</p>
          <button @click.prevent="addRoomOpened = false" class="delete"></button>
        </header>
        <section class="modal-card-body">
          <div class="content">
            <label class="label">Nom de la salle</label>
            <p class="control">
              <input v-model="roomNameInput" class="input" type="text" placeholder="chambre">
            </p>
          </div>
        </section>
        <footer class="modal-card-foot">
          <a @click="addRoom" class="button is-primary">Ajouter</a>
        </footer>
      </div>
    </div>

   

    

    <h1 class="title">Vue d'ensemble</h1>
    <h2 class="subtitle">
      Ici, vous pouvez modéliser votre maison sous forme d'étages et de pièces.
    </h2>

        <div @click="addFloorOpened = true" class="column is-12 notification is-primary clickable">
          <div class="content">
            <p class="title">
              <span class="icon"><i class="fa fa-plus"></i></span>
              Ajouter un étage
            </p>
          </div>
        </div>

  <div v-for="floor in infrastructure.house.floors">
    <div @click="modelizeFloor(floor.rooms)" class="column is-12 notification is-primary clickable">
      <button @click="deleteFloor(floor.id)" class="delete"></button>
      <p class="title">
     <span class="icon"><i class="fa fa-eye"></i></span>
    {{ floor.name }}
    </p>
    </div>
          <div @click="openaddRoomModal(floor.id); canvas.reset()" class="column is-12 notification is-info clickable">
            <p class="title">
              <span class="icon"><i class="fa fa-plus"></i></span>
              Ajouter une salle
              </p>
          </div>
          <canvas id="canvas" :width="windowWidth" height="800"></canvas>
        </div>  
        
  </div>
</template>

<script>
import {mapState, mapActions} from 'eva.js'
import uuid from 'uuid'
import ocanvas from 'ocanvas'

export default {
  data () {
    return {
      floorNameInput: '',
      addFloorOpened: false,
      roomNameInput: '',
      addRoomOpened: false,
      floorId: null,
      windowWidth: window.innerWidth
    }
  },
  computed: {
    ...mapState(['infrastructure'])
  },
  methods: {
    addFloor () {
      this.addFloorAction({ name: this.floorNameInput })
      this.addFloorOpened = false
    },
    addRoom () {
      let tag = "room:" + uuid()
      this.createTag(tag)
      this.addRoomOpened = false
      this.addRoomAction({ name: this.roomNameInput, floor_id: this.floorId, tag_id: tag })
      
      
    },
    openaddRoomModal(id) {
      this.addRoomOpened = true
      this.floorId = id

    },
    async deleteFloor(floorId) {
      await this.deleteFloorAction({ floorId })
    },
    modelizeFloor(rooms) {
      let marge = 33
      let marged = 40
      let i = 1
      let y = 0
      let a = 1
      var canvas = ocanvas.create({
	canvas: "#canvas",
	background: "#ccc",
	fps: 60
});
console.log(rooms)
for(var room in rooms) {
  y++
  if(y > 3) {
    y = 1
   a++
   i = 1
  }
  console.log(rooms[room])
var rectangle = canvas.display.rectangle({
	x: 177 * i + marge * i,
	y: 170 * a + marged * a,
	origin: { x: "center", y: "center" },
	width: 200,
	height: 200,
  stroke: "outside 5px rgba(255, 0, 0, 0.5)"
});
canvas.addChild(rectangle);

rectangle.dragAndDrop();


var text = canvas.display.text({
	x: 0,
	y: -20,
	origin: { x: "center", y: "top" },
	font: "bold 30px sans-serif",
	text: rooms[room].name,
	fill: "#f44"
});

rectangle.addChild(text);
i++
}
this.canvas = canvas
    },
    async createTag (tagId) {
      await this.createTagAction({ id: tagId })
    },
    ...mapActions({ createTagAction: 'createTag', addFloorAction: 'addFloor', addRoomAction: 'addRoom', deleteFloorAction:'deleteFloor' })
  }
}
</script>

<style lang="sass" scoped>
  .clickable
    cursor: pointer
</style>

