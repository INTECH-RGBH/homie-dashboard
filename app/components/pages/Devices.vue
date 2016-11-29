<template>
  <div>
    <h1 class="title">Périphériques</h1>
    <h2 class="subtitle">
      Tous les périphériques de votre maison
    </h2>
    <div class="columns is-multiline is-mobile">
      <template v-for = "device in infrastructure">
        <component v-for="node in device.nodes" :is="types[node.type]" :state = "node.properties" :deviceId = "device.id" :nodeId = "node.id"></component>
      </template>

    </div>
  </div>
</template>

<script>
import {mapState} from "eva.js"

import SwitchDevice from "../devices/Switch"
import LightDevice from "../devices/Light"
import TemperatureDevice from "../devices/Temperature"
import HumidityDevice from "../devices/Humidity"
import ShuttersDevice from "../devices/Shutters"
import DoorDevice from "../devices/Door"
import WindowDevice from "../devices/Window"
import LockDevice from "../devices/Lock"
import HeaterDevice from "../devices/Heater"
import SoundDevice from "../devices/Sound"
import LuminosityDevice from "../devices/Luminosity"
import MotionDevice from "../devices/Motion"
import BuzzerDevice from "../devices/Buzzer"

export default {
  data () {
    return {
      types: {
        'temperature': TemperatureDevice,
        'light': LightDevice,
        'switch': SwitchDevice,
        'humidity': HumidityDevice,
        'shutters': ShuttersDevice,
        'door': DoorDevice,
        'window': WindowDevice,
        'lock': LockDevice,
        'heater': HeaterDevice,
        'sound': SoundDevice,
        'luminosity': LuminosityDevice,
        'motion': MotionDevice,
        'buzzer': BuzzerDevice
      }
    }
  },
  computed: {
    ...mapState(["infrastructure"])
  }
}

</script>

<style lang="sass">
</style>
