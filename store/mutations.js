export default {
  login (state, user) {
    state.user = user
  },
  logout (state) {
    state.user = null
  },
  setCurrentCommands (state, currentCommands) {
    state.currentCommands = currentCommands
  },
  setAllStoryPosts (state, allStoryPosts) {
    state.allStoryPosts = allStoryPosts
  },
  setDelegators (state, delegators) {
    state.delegators = delegators
  },
  setCurators (state, curators) {
    state.curators = curators
  },
}