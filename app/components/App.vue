
<template>
  <div>
    <template v-if="!$route.meta.standalone">
      <div :class="{modal: true, 'is-active': !isConnected}">
        <div class="modal-background"></div>
        <div class="modal-content">
          <div class="notification is-danger">
            Tentative d'établissement de la connexion...
          </div>
        </div>
      </div>

      <homie-header></homie-header>

      <section class="section">
        <div class="container is-fluid">
          <router-view></router-view>
        </div>
      </section>

      <homie-footer></homie-footer>
    </template>
    <template v-else>
      <router-view></router-view>
    </template>
  </div>
</template>

<script>
import {mapState} from 'eva.js'

import HomieHeader from './partials/Header'
import HomieFooter from './partials/Footer'

export default {
  computed: {
    ...mapState(['isConnected'])
  },
  components: { HomieHeader, HomieFooter }
}
</script>

<style lang="sass">
  $homiered: #e74c3c
  $primary: $homiered
  $link-visited: $primary
  @import "~bulma"

  $fa-font-path: "~font-awesome/fonts"
  @import "~font-awesome/scss/font-awesome.scss"

  @import "~balloon-css/src/balloon.scss"
</style>
