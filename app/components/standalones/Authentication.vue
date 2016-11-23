<template>
  <section class="hero is-primary is-bold is-fullheight">
    <div class="hero-body">
      <div class="container has-text-centered">
        <figure class="image is-64x64">
          <img src="../../assets/images/logo_white.png" alt="Logo">
        </figure>
        <h1 class="title">
          Authentifiez-vous.
        </h1>
        <div class="columns">
          <div class="box column is-half is-offset-one-quarter">
            <p class="control has-icon">
              <input v-model="password" @keyup.enter="send" :class="{input: true, 'is-medium': true, 'is-danger': isWrongPassword}" type="password" placeholder="Mot de passe">
              <i class="fa fa-lock"></i>
              <span v-if="isWrongPassword" class="help is-danger">Le mot de passe est invalide.</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import {mapActions, mapState} from 'eva.js'

export default {
  data () {
    return {
      password: '',
      isWrongPassword: false
    }
  },
  computed: {
    ...mapState('intendedRoute')
  },
  methods: {
    async send () {
      const success = await this.login(this.password) // redirected if success
      if (!success) this.isWrongPassword = true
    },
    ...mapActions(['login'])
  }
}
</script>

<style lang="sass" scoped>
  .image {
    margin: auto;
    margin-bottom: 10px;
  }
</style>
