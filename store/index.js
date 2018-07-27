import Vue from 'vue'
import Vuex from 'vuex'
import VueSteemConnect from 'vue-steemconnect'

// make steemconnect available
Vue.use(VueSteemConnect, {
  app: 'themagicfrog.app',
  callbackURL: 'http://localhost:3000/auth'
})

const createStore = () => {
  return new Vuex.Store({
    state: {
      user: null, // logged in user, via steemconnect
    },
    getters: {
      user (state) {
        return state.user
      }
    },
    mutations: {
      login (state, user) {
        state.user = user
      },
      logout (state) {
        state.user = null
      },
    },
    actions: {
      login ({ commit }, accessToken) {
        // return prmoise to be able to wait for the user object to be set
        return new Promise((resolve, reject) => {
          // set access token and try to fetch user object
          Vue.SteemConnect().setAccessToken(accessToken)
          Vue.SteemConnect().me((err, user) => {
            if (err) reject(err)
            else {
              // save user object in store
              commit('login', user)
              resolve()
            }
          })
        })
      },
      logout ({ commit }) {
        // remove access token and unset user in store
        localStorage.removeItem('access_token')
        commit('logout')
      },
    }
  })
}

export default createStore