<template>
  <div>
    <h1 class="title">Périphériques</h1>
    <h2 class="subtitle">
      Tous les périphériques de votre maison
    </h2>

    <nav class="level">
      <div class="level-left">
        <div class="level-item">
          <p class="control has-addons">
            <input v-model="tagInput.value" class="input" type="text" placeholder="Filtrer par tag">
            <ul v-if="tagInput.value !== '' && dropdownTags.length !== 0" id="autocomplete-dropdown">
              <li v-for="tag in dropdownTags"><a href="" @click.prevent="addTag(tag)"><span class="tag" :class="getTagColorClass(tag.color)"><span class="icon is-small"><i class="fa" :class="getTagIconClass(tag.icon)"></i></span>{{ tag.id }}</span></a></li>
            </ul>
          </p>
        </div>
        <div class="level-item">
          <span v-for="id in selectedTagsIds" class="tag" :class="getTagColorClass(infrastructure.tags[id].color)"><span class="icon is-small"><i class="fa" :class="getTagIconClass(infrastructure.tags[id].icon)"></i></span>{{ infrastructure.tags[id].id }}<button @click="deleteTag(id)" class="delete is-small"></button></span>
        </div>
      </div>

      <div class="level-item has-text-centered">
        <p class="subtitle is-5">
          <strong>{{ filteredNodes.length }}</strong> périphériques correspondants
        </p>
      </div>

      <div class="level-right">
        <p class="level-item">
          <strong v-if="selectedDeviceState === DEVICE_STATES.ONLINE">En ligne</strong>
          <a v-else @click="selectedDeviceState = DEVICE_STATES.ONLINE" class="button is-success">En ligne</a>
        </p>
        <p class="level-item">
          <strong v-if="selectedDeviceState === null">Tous</strong>
          <a v-else @click="selectedDeviceState = null" class="button">Tous</a>
        </p>
        <p class="level-item">
          <strong v-if="selectedDeviceState === DEVICE_STATES.OFFLINE">Hors ligne</strong>
          <a v-else @click="selectedDeviceState = DEVICE_STATES.OFFLINE" class="button is-danger">Hors ligne</a>
        </p>
      </div>
    </nav>

    <div class="columns is-multiline is-mobile">
      <component v-for="node in filteredNodes" :is="types[node.type]" :nodeData="node"></component>
    </div>
  </div>
</template>

<script>
import {mapState} from 'eva.js'

import SwitchDevice from '../devices/Switch'
import LightDevice from '../devices/Light'
import TemperatureDevice from '../devices/Temperature'
import HumidityDevice from '../devices/Humidity'
import ShuttersDevice from '../devices/Shutters'
import DoorDevice from '../devices/Door'
import WindowDevice from '../devices/Window'
import LockDevice from '../devices/Lock'
import HeaterDevice from '../devices/Heater'
import SoundDevice from '../devices/Sound'
import LuminosityDevice from '../devices/Luminosity'
import MotionDevice from '../devices/Motion'
import BuzzerDevice from '../devices/Buzzer'

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
      },
      tagInput: { value: '' },
      selectedTagsIds: [],
      DEVICE_STATES: {
        ONLINE: 'ONLINE',
        OFFLINE: 'OFFLINE'
      },
      selectedDeviceState: null
    }
  },
  computed: {
    dropdownTags () {
      return Object.values(this.infrastructure.tags).filter((tag) => {
        return tag.id.includes(this.tagInput.value) && !this.selectedTagsIds.includes(tag.id)
      })
    },
    filteredNodes () {
      const nodes = []
      Object.values(this.infrastructure.devices).forEach((device) => {
        if (this.selectedDeviceState) {
          const onlineWanted = this.selectedDeviceState === this.DEVICE_STATES.ONLINE
          if (device.online !== onlineWanted) return
        }

        // device is ok

        Object.values(device.nodes).forEach((node) => {
          for (const tagId of this.selectedTagsIds) {
            if (!node.tags.includes(tagId)) return
          }

          // node is ok

          nodes.push({ device, ...node })
        })
      })

      return nodes
    },
    ...mapState(['infrastructure'])
  },
  methods: {
    getTagColorClass (color) {
      const obj = {}
      obj[`is-${color}`] = true
      return obj
    },
    getTagIconClass (icon) {
      const obj = {}
      obj[`fa-${icon}`] = true
      return obj
    },
    addTag (tag) {
      this.selectedTagsIds.push(tag.id)
    },
    deleteTag (tagId) {
      this.selectedTagsIds.splice(this.selectedTagsIds.indexOf(tagId), 1)
    }
  }
}

</script>

<style lang="sass" scoped>
  ul#autocomplete-dropdown
    position: absolute
    top: 31px

    width: 166px

    padding: 10px

    background-color: #fff
    border: 1px solid #dbdbdb
    border-radius: 0 0 3px 3px

    z-index: 1

    li
      margin-bottom: 5px

      &:last-of-type
        margin-bottom: 0
</style>
