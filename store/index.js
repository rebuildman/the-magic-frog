import Vuex from 'vuex'

const createStore = () => {
  return new Vuex.Store({
    state: {
      voteWeight: 100,
      voteTarget: null
    },
    getters: {
      voteWeight (state) {
        return state.voteWeight
      },
      voteTarget (state) {
        return state.voteTarget
      }
    },
    mutations: {
      voteWeight (state, weight) {
        state.voteWeight = weight
        // ensure min/max value
        state.voteWeight = state.voteWeight > 100 ? 100 : state.voteWeight
        state.voteWeight = state.voteWeight < 0 ? 0 : state.voteWeight
      },
      voteTarget (state, target) {
        state.voteTarget = target
      }
    }
  })
}

export default createStore