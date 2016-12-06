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
          Loool
        </section>
        <footer class="modal-card-foot">
          <a @click="settingsOpened = false" class="button is-primary">OK</a>
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
        <span class="card-header-icon custom wifi" :class="getWifiIconClasses(nodeData.device.stats.signal)" :data-balloon="`Signal : ${nodeData.device.stats.signal}%`" data-balloon-pos="up">
          <i class="fa fa-wifi"></i>
        </span>
        <span class="card-header-icon custom online" :class="getOnlineIconClasses(nodeData.device.online)" :data-balloon="`${nodeData.device.online ? 'En ligne' : 'Hors-ligne'}`" data-balloon-pos="up">
          <i class="fa fa-circle"></i>
        </span>
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
export default {
  props: ['nodeData', 'hasActions'],
  data () {
    return {
      settingsOpened: false
    }
  },
  methods: {
    getWifiIconClasses (signal) {
      return {
        'is-weak': signal >= 0 && signal <= 33,
        'is-normal': signal > 33 && signal <= 66,
        'is-strong': signal > 66
      }
    },
    getOnlineIconClasses (online) {
      return {
        'is-yes': online,
        'is-no': !online
      }
    }
  }
}
</script>

<style lang="sass" scoped>
  $red: #e74c3c
  $orange: #d35400
  $green: #27ae60
  $gray: #363636

  .card-header-icon.settings
    color: $gray

  .card-header-icon.custom
    width: 20px

    cursor: default

    &.wifi
      &.is-weak
        color: $red
      &.is-normal
        color: $orange
      &.is-strong
        color: $green

    &.online
      &.is-yes
        color: $green
      &.is-no
        color: $red
</style>
