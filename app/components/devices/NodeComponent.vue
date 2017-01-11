<template>
  <div class="column is-6-mobile is-3-tablet is-2-desktop">
    <div class="modal" :class="{ 'is-active': settingsOpened }">
      <div class="modal-background"></div>
      <div class="modal-card">
        <header class="modal-card-head">
          <p class="modal-card-title">Paramètres du nœud <i>{{ nodeData.id }}</i> de l'objet <i>{{ nodeData.device.name }}</i></p>
          <button @click.prevent="settingsOpened = false" class="delete"></button>
        </header>
        <section class="modal-card-body">
          <div class="content">
            <h2>Informations sur l'objet</h2>

            <ul>
              <li>Nom : {{ nodeData.device.name }}</li>
              <li>Firmware : {{ nodeData.device.fw.name }} (v{{ nodeData.device.fw.version }})</li>
            </ul>

            <h2>Tags</h2>

            <ul class="tag-list">
              <li v-for="tag in infrastructure.tags" @click="toggleTag(tag)"><span class="tag" :class="{ 'is-success': nodeData.tags.includes(tag.id) }"><span class="icon is-small"><i class="fa fa-tag"></i></span>&nbsp;{{ tag.id }}</span></li>
            </ul>
          </div>
        </section>
        <footer class="modal-card-foot">
          <a @click="settingsOpened = false" class="button is-primary">OK</a>
        </footer>
      </div>
    </div>

    <div class="modal" :class="{ 'is-active': statsOpened }">
      <div class="modal-background"></div>
      <div class="modal-card">
        <header class="modal-card-head">
          <p class="modal-card-title">Statistiques du nœud <i>{{ nodeData.id }}</i> de l'objet <i>{{ nodeData.device.name }}</i></p>
          <button @click.prevent="statsOpened = false" class="delete"></button>
        </header>
        <section class="modal-card-body">
          <div class="content">
            <statistical :nodeId="nodeData.id"></statistical>
          </div>
        </section>
        <footer class="modal-card-foot">
          <a @click="statsOpened = false" class="button is-primary">Fermer</a>
        </footer>
      </div>
    </div>

    <div class="card">
      <header class="card-header">
        <p class="card-header-title">
          <template v-if="nodeData">
            {{ nodeData.device.name }}
          </template>
        </p>
        <span class="card-header-icon custom wifi" :class="getSignalIconClasses(nodeData.device.online, nodeData.device.stats.signal)" :data-balloon="`${nodeData.device.online ? 'En ligne' : 'Hors-ligne'}, signal : ${nodeData.device.stats.signal}%`" data-balloon-pos="up">
          <i class="fa fa-wifi"></i>
        </span>
        <a @click.prevent="statsOpened = true" class="card-header-icon charts">
          <i class="fa fa-line-chart"></i>
        </a>
        <a @click.prevent="settingsOpened = true" class="card-header-icon settings">
          <i class="fa fa-cog"></i>
        </a>
      </header>

      <div class="card-image">
        <figure class="image is-256x256">
          <slot name="img"></slot>
        </figure>
      </div>

      <div class="card-content">
        <div class="content">
          <slot name="main"></slot>
        </div>
      </div>

      <footer v-if="hasActions" class="card-footer">
        <slot name="footer"></slot>
      </footer>
    </div>
  </div>
</template>

<script>
import {mapState, mapActions} from 'eva.js'
import Statistical from './Statistical'

export default {
  props: ['nodeData', 'hasActions'],
  data () {
    return {
      settingsOpened: false,
      statsOpened: false
    }
  },
  components: {Statistical},
  computed: {
    ...mapState(['infrastructure'])
  },
  methods: {
    getSignalIconClasses (online, signal) {
      return {
        'is-offline': !online,
        'is-weak': online && signal <= 66,
        'is-strong': online && signal > 66
      }
    },
    async toggleTag (tag) {
      const operationAdd = !this.nodeData.tags.includes(tag.id)

      await this.toggleTagAction({
        deviceId: this.nodeData.device.id,
        nodeId: this.nodeData.id,
        tagId: tag.id,
        operationAdd
      })
    },
    ...mapActions({ toggleTagAction: 'toggleTag' })
  }
}
</script>

<style lang="sass" scoped>
  $red: #e74c3c
  $orange: #d35400
  $green: #27ae60
  $gray: #363636

  .card-header-icon.settings, .card-header-icon.charts
    color: $gray

  .card-header-icon.charts
    padding-right: 0

  .card-header-icon.custom
    width: 20px

    cursor: default

    &.wifi
      &.is-offline
        color: $red
      &.is-weak
        color: $orange
      &.is-strong
        color: $green

  ul.tag-list
    list-style-type: none

    li
      display: inline-block
      cursor: pointer
</style>

  <style lang="sass">
    $track-color: rgba(0, 0, 0, .6) !default
    $thumb-color: #e74c3c !default

    $thumb-radius: 17px !default
    $thumb-height: 17px !default
    $thumb-width: 17px !default
    $thumb-shadow-size: 0 !default
    $thumb-shadow-blur: 0 !default
    $thumb-shadow-color: #111 !default
    $thumb-border-width: 0 !default
    $thumb-border-color: #fff !default

    $track-width: 100% !default
    $track-height: 2px !default
    $track-shadow-size: 0 !default
    $track-shadow-blur: 0 !default
    $track-shadow-color: #000 !default
    $track-border-width: 0 !default
    $track-border-color: #000 !default

    $track-radius: 5px !default
    $contrast: 5% !default

    @mixin shadow($shadow-size, $shadow-blur, $shadow-color)
      box-shadow: $shadow-size $shadow-size $shadow-blur $shadow-color, 0 0 $shadow-size lighten($shadow-color, 5%)

    @mixin track()
      width: $track-width
      height: $track-height
      cursor: pointer
      transition: all .2s ease

    @mixin thumb()
      @include shadow($thumb-shadow-size, $thumb-shadow-blur, $thumb-shadow-color)
      border: $thumb-border-width solid $thumb-border-color
      height: $thumb-height
      width: $thumb-width
      border-radius: $thumb-radius
      background: $thumb-color
      cursor: pointer

    [type=range]
      -webkit-appearance: none
      margin: $thumb-height / 2 0
      width: $track-width

      &:focus
        outline: none

      &::-webkit-slider-runnable-track
        @include track()
        @include shadow($track-shadow-size, $track-shadow-blur, $track-shadow-color)
        background: $track-color
        border: $track-border-width solid $track-border-color
        border-radius: $track-radius


      &::-webkit-slider-thumb
        @include thumb()
        -webkit-appearance: none
        margin-top: ((-$track-border-width * 2 + $track-height) / 2) - ($thumb-height / 2)


      &:focus::-webkit-slider-runnable-track
        background: lighten($track-color, $contrast)


      &::-moz-range-track
        @include track()
        @include shadow($track-shadow-size, $track-shadow-blur, $track-shadow-color)
        background: $track-color
        border: $track-border-width solid $track-border-color
        border-radius: $track-radius

      &::-moz-range-thumb
        @include thumb()


      &::-ms-track
        @include track()
        background: transparent
        border-color: transparent
        border-width: $thumb-width 0
        color: transparent


      &::-ms-fill-lower
        @include shadow($track-shadow-size, $track-shadow-blur, $track-shadow-color)
        background: darken($track-color, $contrast)
        border: $track-border-width solid $track-border-color
        border-radius: $track-radius * 2

      &::-ms-fill-upper
        @include shadow($track-shadow-size, $track-shadow-blur, $track-shadow-color)
        background: $track-color
        border: $track-border-width solid $track-border-color
        border-radius: $track-radius * 2


      &::-ms-thumb
        @include thumb()


      &:focus::-ms-fill-lower
        background: $track-color


      &:focus::-ms-fill-upper
        background: lighten($track-color, $contrast)
  </style>
