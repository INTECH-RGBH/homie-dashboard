Homie Dashboard
===============

[![Build Status](https://travis-ci.org/INTECH-RGBH/homie-dashboard.svg?branch=master)](https://travis-ci.org/INTECH-RGBH/homie-dashboard) [![Known Vulnerabilities](https://snyk.io/test/github/intech-rgbh/homie-dashboard/badge.svg)](https://snyk.io/test/github/intech-rgbh/homie-dashboard) [![dependencies Status](https://david-dm.org/INTECH-RGBH/homie-dashboard/status.svg)](https://david-dm.org/INTECH-RGBH/homie-dashboard) [![devDependencies Status](https://david-dm.org/INTECH-RGBH/homie-dashboard/dev-status.svg)](https://david-dm.org/INTECH-RGBH/homie-dashboard?type=dev)

## Contribute

* Install [Node.js](https://nodejs.org/en/) >= v7.0.0
* Install [Yarn](https://yarnpkg.com/) (optional, recommended): `npm install -g yarn`
* Clone this repository
* `cd` into it
* Install the project dependencies:
  * With Yarn (recommended): `yarn install`
  * Or with npm: `npm install`
* Run one of the following scripts:
  * `npm run app-build`: build the Web Application into the `dist-app` directory
  * `npm run app-dev`: start a webpack development server, with hot-reload
  * `npm run server-build`: build the server from an ES2015 syntax to Node.js runnable code in the `dist-server` directory
  * `npm run server-dev`: start the server for development with automatic restart on code changes
  * `npm run server-lint`: lint the server
  * `npm run server-serve`: start the compiled version of the server (run from the `dist-server` directory)
  * `npm run server-test`: test the server

## Team stuff

We all code on Windows. Install [Mosquitto](https://mosquitto.org/download/) and run in the context of the repo: `dev.bat`. This will start the MQTT broker, the development server and the development Web Application.
