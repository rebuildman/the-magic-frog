import Vuex from 'vuex';

import getters from './getters';
import mutations from './mutations';
import actions from './actions';

const createStore = () => new Vuex.Store({
  state: {
    user: null, // logged in user, via steemconnect
    currentCommands: [], // submissions of the current day
    stories: [], // every story's last post
    allStoryPosts: [], // all posts from all stories
    contributors: [], // everyone who contributed to a story (in current language)
    delegators: [], // with amount of delegation
    curators: [], // with overall rshares contributed to the project
    rsharesToSBDFactor: null, // multiply rshares by this factor to get SBD value
  },
  getters,
  mutations,
  actions,
});

export default createStore;
