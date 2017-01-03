<template>
  <section class="hero is-primary is-bold is-fullheight">
    <template v-if="step === 'WAITING_FOR_DEVICE'">
      <div class="hero-body">
        <div class="container has-text-centered">
          <h1 class="title">
            Connectez-vous au réseau Wi-Fi de votre périphérique.
          </h1>
          <i class="fa fa-circle-o-notch fa-spin fa-3x fa-fw"></i><br><br>
          <h2 class="subtitle">
            Le nom du réseau Wi-Fi est de la forme <strong>Homie-123456abcdef</strong>.
          </h2>
        </div>
      </div>
    </template>

    <template v-if="step === 'ADD_DEVICE_CONFIRMATION'">
      <div class="hero-body">
        <div class="container has-text-centered">
          <h1 class="title">
            Homie-{{ deviceInfo['hardware_device_id'] }}
          </h1>
          <h2 class="subtitle">
            Souhaitez-vous ajouter ce périphérique ?
          </h2>
          <a class="button is-success" @click.prevent="STEP = 'INPUT_DEVICE_NAME'">Oui</a>
          <a class="button is-black" @click.prevent="step = 'ABORTED'">Non</a>
        </div>
      </div>
    </template>

    <template v-if="step === 'INPUT_DEVICE_NAME'">
      <div class="hero-body">
        <div class="container has-text-centered">
          <h1 class="title">
            Entrez un nom pour le périphérique.
          </h1>

          <p class="control has-icon">
            <input v-model="deviceName" class="input is-medium" type="text" placeholder="Nom du périphérique">
            <i class="fa fa-hashtag"></i>
          </p>

          <a :disabled="deviceName === ''" :class="{button: true, 'is-loading': putConfigOngoing}" @click.prevent="sendConfiguration">OK</a>
        </div>
      </div>
    </template>

    <template v-if="step === 'SEND_CONFIG_RESULT'">
      <div class="hero-body">
        <div class="container has-text-centered">
          <h1 class="title">
            {{ putConfigResult.success ? 'Succès' : 'Échec' }}.
          </h1>
          <div v-if="putConfigResult.success === true" class="notification is-success">
            Votre périphérique va s'afficher dans votre Dashboard d'ici quelques secondes. Vous pouvez fermer cette page.
          </div>
          <div v-else class="notification is-danger">
            Une erreur est survenue. Merci de réessayer. Erreur : {{ putConfigResult.error }}
          </div>
          <a class="button is-black" @click.prevent="close">Fermer</a>
        </div>
      </div>
    </template>

    <template v-if="step === 'ABORTED'">
      <div class="hero-body">
        <div class="container has-text-centered">
          <h1 class="title">
            Ajout de périphérique annulé.
          </h1>
          <h2 class="subtitle">
            Déconnectez-vous du réseau Wi-Fi <strong>Homie-{{ deviceInfo['hardware_device_id'] }}</strong>, reconnectez-vous à votre réseau habituel puis fermez cette page.
          </h2>
          <a class="button is-black" @click.prevent="close">Fermer</a>
        </div>
      </div>
    </template>
  </section>
</template>

<script>
import axios from 'axios'
import {mapActions} from 'eva.js'

import {HOMIE_ESP8266_AP_SERVER_URL} from '../../constants'

const STEPS = {
  WAITING_FOR_DEVICE: 'WAITING_FOR_DEVICE',
  ADD_DEVICE_CONFIRMATION: 'ADD_DEVICE_CONFIRMATION',
  INPUT_DEVICE_NAME: 'INPUT_DEVICE_NAME',
  SEND_CONFIG_RESULT: 'SEND_CONFIG_RESULT',
  ABORTED: 'ABORTED'
}

export default {
  data () {
    return {
      step: STEPS.WAITING_FOR_DEVICE,
      deviceInfo: {},
      deviceInfoRequestOngoing: false,
      deviceName: '',
      interval: null,
      putConfigResult: {},
      putConfigOngoing: false
    }
  },
  mounted () {
    this.interval = setInterval(this.checkHeartbeat, 2000)
  },
  methods: {
    async checkHeartbeat () {
      if (this.deviceInfoRequestOngoing) return

      try {
        this.deviceInfoRequestOngoing = true
        const res = await axios.get(`${HOMIE_ESP8266_AP_SERVER_URL}/device-info`)
        clearInterval(this.interval)
        this.deviceInfo = res.data
        this.step = STEPS.ADD_DEVICE_CONFIRMATION
      } catch (err) {
        console.log(err)
      } finally {
        this.deviceInfoRequestOngoing = false
      }
    },
    async sendConfiguration () {
      if (this.putConfigOngoing) return

      const settings = await this.getHomieEsp8266Settings()
      console.log(settings)

      try {
        this.putConfigOngoing = true
        const res = await axios.put(`${HOMIE_ESP8266_AP_SERVER_URL}/config`, {
          name: this.deviceName,
          wifi: {
            ssid: settings.wifi.ssid,
            password: settings.wifi.password
          },
          mqtt: {
            host: settings.mqtt.host,
            port: settings.mqtt.port
          },
          ota: {
            enabled: true
          }
        })
        this.putConfigResult = res.data
        this.step = STEPS.SEND_CONFIG_RESULT
      } catch (err) {
        if (err.response) this.putConfigResult = err.response.data
        else this.putConfigResult = { error: err.message }
        this.step = STEPS.SEND_CONFIG_RESULT
      } finally {
        this.putConfigOngoing = false
      }
    },
    close () {
      window.close()
    },
    ...mapActions(['getHomieEsp8266Settings'])
  }
}
</script>

<style lang="sass">
</style>
