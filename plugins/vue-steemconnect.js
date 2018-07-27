import Vue from 'vue'
import VueSteemConnect from 'vue-steemconnect'

Vue.use(VueSteemConnect, {
  app: 'themagicfrog.app',
  callbackURL: 'http://localhost:3000/auth'
})