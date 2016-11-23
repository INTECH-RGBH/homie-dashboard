import EVA from 'eva.js'
import App from './components/App'

import initializeStore from './store/app'

import Overview from './components/pages/Overview'
import Devices from './components/pages/Devices'

import Authentication from './components/standalones/Authentication'
import AddDevice from './components/standalones/AddDevice'

import {SET_INTENDED_ROUTE} from './store/app'

const app = new EVA({ mode: 'history' })

initializeStore(app)

app.router(route => [
  { meta: { title: "Vue d'ensemble" }, ...route('/', Overview) },
  { meta: { title: 'Périphériques' }, ...route('/peripheriques', Devices) },

  { meta: { title: 'Authentifiez-vous', standalone: true }, ...route('/authentification', Authentication) },
  { meta: { title: "Ajout d'un périphérique", standalone: true }, ...route('/ajout-peripherique', AddDevice) },

  { path: '*', redirect: '/' }
])

app.$router.beforeEach((to, from, next) => {
  if (to.path !== '/authentification') app.$store.commit(SET_INTENDED_ROUTE, to.path)
  if (!app.$store.state.isAuthentified && to.path !== '/authentification') return next('/authentification')
  if (app.$store.state.isAuthentified && to.path === '/authentification') return next('/')

  next()
})

app.$router.afterEach((to, from) => {
  document.title = `${to.meta.title} - Homie Dashboard`
})

app.start(App, '#app')
