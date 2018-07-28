import Vue from 'vue'
import VueSteemConnect from 'vue-steemconnect'
import axios from 'axios'

// make steemconnect available
Vue.use(VueSteemConnect, {
  app: 'themagicfrog.app',
  callbackURL: 'http://localhost:3000/auth'
})

export default {
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
  updateData ({ dispatch }) {
    dispatch('fetchCurrentCommands')
    dispatch('fetchAllStoryPosts')
    dispatch('fetchDelegators')
    dispatch('fetchCurators')
  },
  fetchCurrentCommands ({ commit }) {
    return new Promise((resolve, reject) => {
      axios.get('https://api.the-magic-frog.com/submissions?account=' + Vue.prototype.$account).then((result) => {
        commit('setCurrentCommands', result.data)
        resolve(result.data);
      }).catch((err) => {
        reject(err);
      });
    });
  },
  fetchAllStoryPosts ({ commit }) {
    return new Promise((resolve, reject) => {
      axios.get('https://api.the-magic-frog.com/storyposts?account=' + Vue.prototype.$account).then((result) => {
        commit('setAllStoryPosts', result.data)
        resolve(result.data);
      }).catch((err) => {
        reject(err);
      });
    });
  },
  fetchDelegators ({ commit }) {
    return new Promise((resolve, reject) => {
      axios.get('https://api.the-magic-frog.com/delegators?account=' + Vue.prototype.$account).then((result) => {
        commit('setDelegators', result.data)
        resolve(result.data);
      }).catch((err) => {
        reject(err);
      });
    });
  },
  fetchCurators ({ commit }) {
    return new Promise((resolve, reject) => {
      // Getting the top 12 curators of the frog account
      axios.get('https://api.the-magic-frog.com/curators?top=100&account=' + Vue.prototype.$account).then((result) => {
        commit('setCurators', result.data)
        resolve(result.data);
      }).catch((err) => {
        reject(err);
      });
    });
  },
}