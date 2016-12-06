import mqtt from 'mqtt'

/**
 * This function creates an MQTT client
 * @param {Object} options options to be passed to the `mqtt` module `connect()` function
 * @returns {module:mqtt.Client} promise, to be resolved on success with the settings or rejected on failure
 */
export default function createMqttClient (options) {
  return mqtt.connect(options)
}
