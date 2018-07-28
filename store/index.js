import Vuex from 'vuex'

import getters from './getters'
import mutations from './mutations'
import actions from './actions'

const createStore = () => {
  return new Vuex.Store({
    state: {
      user: null, // logged in user, via steemconnect
      currentCommands: [], // submissions of the current day
      allStoryPosts: [], // all posts from all stories
      delegators: [], // with amount of delegation
      curators: [], // with overall rshares contributed to the project
    },
    getters,
    mutations,
    actions
  })
}

export default createStore