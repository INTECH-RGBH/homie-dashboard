<template>
  <section class="hero is-primary is-bold">
    <div class="hero-head">
      <header class="nav">
        <div class="container">
          <div class="nav-left">
            <span class="nav-item is-brand">
              <figure class="image is-24x24">
                <img src="../../assets/images/logo_white.png" alt="Logo">
              </figure>
            </span>
          </div>

          <span @click="triggerMobileMenu" :class="{'nav-toggle': true, 'is-active': isMobileMenuActive}">
            <span></span>
            <span></span>
            <span></span>
          </span>

          <div :class="{'nav-right': true, 'nav-menu': true, 'is-active': isMobileMenuActive}">
            <span class="nav-item">
              <a class="button is-light is-outlined" @click.prevent="openConfiguratorPopup">
                <span class="icon">
                  <i class="fa fa-plus-circle"></i>
                </span>
                <span>Ajouter un périphérique</span>
              </a>
            </span>
            <span class="nav-item">
              <a class="button is-primary is-inverted" @click.prevent="logout">
                <span class="icon">
                  <i class="fa fa-sign-out"></i>
                </span>
                <span>Se déconnecter</span>
              </a>
            </span>
          </div>
        </div>
      </header>
    </div>

    <div class="hero-body">
      <div class="container">
        <h1 class="title">
          Homie Dashboard
        </h1>
        <h2 class="subtitle">
          Contrôlez votre maison.
        </h2>
      </div>
    </div>

    <div class="hero-foot">
      <nav class="tabs is-boxed">
        <div class="container">
          <ul>
            <li :class="{ 'is-active': route.path === '/' }"><router-link to="/" exact>Vue d'ensemble</router-link></li>
            <li :class="{ 'is-active': route.path === '/peripheriques' }"><router-link to="/peripheriques" exact>Périphériques</router-link></li>
          </ul>
        </div>
      </nav>
    </div>
  </section>
</template>

<script>
import {mapState, mapActions} from 'eva.js'

export default {
  data () {
    return {
      isMobileMenuActive: false
    }
  },
  computed: {
    ...mapState(['route'])
  },
  methods: {
    triggerMobileMenu () {
      this.isMobileMenuActive = !this.isMobileMenuActive
    },
    openConfiguratorPopup () {
      window.open('/ajout-peripherique', '', 'width=500, height=300')
    },
    ...mapActions(['logout'])
  }
}
</script>

<style lang="sass">
</style>
