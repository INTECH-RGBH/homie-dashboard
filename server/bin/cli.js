#!/usr/bin/env node

'use strict'

import ip from 'internal-ip'
import clor from 'clor'
import yargs from 'yargs'

import {bootstrap} from '../index'
import pkg from '../../package'

const argv = yargs
  .usage('Usage: $0 [options]')
  .option('ip', {
    describe: 'IP you want to listen to. Defaults to 127.0.0.1'
  })
  .option('port', {
    describe: 'Port you want to listen to. Defaults to 80'
  })
  .option('dataDir', {
    describe: "Top directory you want Homie's data to be stored in. Defaults to CWD"
  })
  .option('logLevel', {
    describe: 'Minimum log level for console output. Defaults to info'
  })
  .help()
  .locale('en')
  .argv

// Font: Dr Pepper
const homieStyled = clor.magenta(`\
 _____           _        ____          _   _                 _
|  |  |___ _____|_|___   |    \\ ___ ___| |_| |_ ___ ___ ___ _| |
|     | . |     | | -_|  |  |  | .'|_ -|   | . | . | .'|  _| . |
|__|__|___|_|_|_|_|___|  |____/|__,|___|_|_|___|___|__,|_| |___|
`)

console.log(homieStyled.toString())
console.log(clor.magenta('Version ').bold.magenta(pkg.version).line())

console.log(clor.magenta('See ').underline.magenta('https://github.com/INTECH-RGBH/homie-dashboard').line())

console.log(clor.magenta('Homie Dashboard IP is ').bold.underline.magenta(ip.v4())())
console.log(clor.magenta("Make sure this IP won't change over time").line())

bootstrap({
  ip: argv.ip || '127.0.0.1',
  port: argv.port || 80,
  dataDir: argv.dataDir || './',
  logLevel: argv.logLevel || 'info'
})
