import EVA from 'eva.js'
import cookie from 'cookie'
import App from './components/App'

import initializeStore, {SET_INTENDED_ROUTE, SET_IS_AUTHENTIFIED} from './store/app'

import Overview from './components/pages/Overview'
import Devices from './components/pages/Devices'

import Authentication from './components/standalones/Authentication'
import AddDevice from './components/standalones/AddDevice'

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
  if (app.$store.state.isAuthentified) {
    if (to.path === '/authentification') return next('/')
  } else {
    if (cookie.parse(document.cookie).hasOwnProperty('ACCESSTOKEN_SET')) {
      app.$store.commit(SET_IS_AUTHENTIFIED, true)
      app.$store.dispatch('startWs')
      if (to.path === '/authentification') return next('/')
      else return next()
    }

    if (to.path !== '/authentification') {
      app.$store.commit(SET_INTENDED_ROUTE, to.path)
      return next('/authentification')
    }
  }

  next()
})

app.$router.afterEach((to, from) => {
  document.title = `${to.meta.title} - Homie Dashboard`
})

app.start(App, '#app')
