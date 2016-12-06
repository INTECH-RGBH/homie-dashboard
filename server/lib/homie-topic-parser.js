export const TOPIC_TYPES = {
  BROADCAST: 'BROADCAST',
  DEVICE_PROPERTY: 'DEVICE_PROPERTY',
  NODE_SPECIAL_PROPERTY: 'NODE_SPECIAL_PROPERTY',
  NODE_PROPERTY: 'NODE_PROPERTY',
  NODE_PROPERTY_SET: 'NODE_PROPERTY_SET',
  INVALID: 'INVALID'
}

/**
 * This function validates the ID format of the Homie convention
 * @param {string} id ID to test
 * @returns {bool} `true` if valid, `false` if not
 */
const validateIdFormat = (id) => /^[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/.test(id)

/**
 * This class parses Homie topics
 */
class HomieTopicParser {
  /**
   * Constructor
   @param {string} baseTopic Base topic of Homie
   */
  constructor (baseTopic = 'homie/') {
    this.setBaseTopic(baseTopic)
  }

  /**
   * This function sets the base topic of Homie
   @param {string} baseTopic Base topic of Homie
   */
  setBaseTopic (baseTopic) {
    this.baseTopic = baseTopic
  }

  /**
   * This function parses an Homie topic
   @param {string} topic Topic to parse
   @param {value} value to parse
   @returns {type: TOPIC_TYPES} all related properties
   */
  parse (topic, value) {
    if (!topic.startsWith(this.baseTopic)) return { type: TOPIC_TYPES.INVALID }

    topic = topic.substr(this.baseTopic.length)  // Remove base topic
    const splittedTopic = topic.split('/')
    const length = splittedTopic.length

    if (length === 2 && splittedTopic[0] === '$broadcast') {  // Checking key word for global broadcast
      const level = splittedTopic[1]
      if (!validateIdFormat(level)) return { type: TOPIC_TYPES.INVALID }

      return {
        type: TOPIC_TYPES.BROADCAST,
        level,
        value
      }
    } else if (length >= 2 && splittedTopic[1].startsWith('$')) {  // If [1] starts with $ then device property
      const deviceId = splittedTopic.shift()
      if (!validateIdFormat(deviceId)) return { type: TOPIC_TYPES.INVALID }

      return {
        type: TOPIC_TYPES.DEVICE_PROPERTY,
        deviceId,
        property: splittedTopic.join('/').substr(1),  // Remove $
        value
      }
    } else if (length === 3) {  // node property
      const deviceId = splittedTopic[0]
      const nodeId = splittedTopic[1]
      if (!validateIdFormat(deviceId) || !validateIdFormat(nodeId)) return { type: TOPIC_TYPES.INVALID }

      const type = splittedTopic[2].startsWith('$') ? TOPIC_TYPES.NODE_SPECIAL_PROPERTY : TOPIC_TYPES.NODE_PROPERTY
      let property
      if (type === TOPIC_TYPES.NODE_SPECIAL_PROPERTY) {
        property = splittedTopic[2].substr(1)
      } else {
        property = splittedTopic[2]
        if (!validateIdFormat(property)) return { type: TOPIC_TYPES.INVALID }
      }

      return {
        type,
        deviceId,
        nodeId,
        property,
        value
      }
    } else if (length === 4 && splittedTopic[3] === 'set') {  // If length is 4 and [5] is set then set
      const deviceId = splittedTopic[0]
      const nodeId = splittedTopic[1]
      const property = splittedTopic[2]
      if (!validateIdFormat(deviceId) || !validateIdFormat(nodeId) || !validateIdFormat(property)) return { type: TOPIC_TYPES.INVALID }

      return {
        type: TOPIC_TYPES.NODE_PROPERTY_SET,
        deviceId,
        nodeId,
        property,
        value
      }
    } else {  // An error has occured, topic must be one of the above
      return { type: TOPIC_TYPES.INVALID }
    }
  }
}

export default new HomieTopicParser()
