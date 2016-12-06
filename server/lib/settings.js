import fs from 'fs'
import path from 'path'

import toml from 'toml'

/**
 * This function loads settings from a TOML file
 * @returns {Promise} promise, to be resolved on success with the settings or rejected on failure
 */
export default function load () {
  return new Promise((resolve, reject) => {
    fs.readFile(path.join(__dirname, '../../settings.toml'), 'utf8', (err, data) => {
      if (err) return reject(err)

      const settings = toml.parse(data)
      resolve(settings)
    })
  })
}
