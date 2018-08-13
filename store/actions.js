import Vue from 'vue';
import VueSteemConnect from 'vue-steemconnect';
import axios from 'axios';
import steem from 'steem';

// make steemconnect available
Vue.use(VueSteemConnect, {
  app: 'themagicfrog.app',
  callbackURL: process.env.scRedirectUrl,
});

export default {
  login({ commit, state }) {
    // return promise to be able to wait for the user object to be set
    return new Promise((resolve, reject) => {
      // user will be set, when coming from auth page
      // but not if accessed this page directly
      if (!state.user) {
        // in that case we look for an access token in localStorage
        const accessToken = localStorage.getItem('access_token');
        if (accessToken) {
          // set access token and try to fetch user object
          Vue.SteemConnect().setAccessToken(accessToken);
          Vue.SteemConnect().me((err, user) => {
            if (err) reject(err);
            else {
              // save user object in store
              commit('login', user);
              resolve();
            }
          });
        }
      }
    });
  },
  logout({ commit }) {
    // remove access token and unset user in store
    localStorage.removeItem('access_token');
    commit('logout');
  },
  updateData({ dispatch }) {
    dispatch('fetchCurrentCommands');
    dispatch('fetchAllStoryPosts');
    dispatch('fetchDelegators');
    dispatch('fetchCurators');
  },
  fetchCurrentCommands({ commit }) {
    return new Promise((resolve, reject) => {
      axios.get(`https://api.the-magic-frog.com/submissions?account=${Vue.prototype.$account}`).then((result) => {
        commit('setCurrentCommands', result.data);
        resolve(result.data);
      }).catch((err) => {
        reject(err);
      });
    });
  },
  fetchStories({ commit }) {
    return new Promise((resolve, reject) => {
      axios.get(`https://api.the-magic-frog.com/stories?account=${Vue.prototype.$account}`).then((result) => {
        commit('setStories', result.data);
        resolve(result.data);
      }).catch((err) => {
        reject(err);
      });
    });
  },
  fetchAllStoryPosts({ commit }) {
    return new Promise((resolve, reject) => {
      axios.get(`https://api.the-magic-frog.com/storyposts?account=${Vue.prototype.$account}`).then((result) => {
        commit('setAllStoryPosts', result.data);
        resolve(result.data);
      }).catch((err) => {
        reject(err);
      });
    });
  },
  fetchContributors({ commit }) {
    return new Promise((resolve, reject) => {
      axios.get(`https://api.the-magic-frog.com/contributors?account=${Vue.prototype.$account}`).then((result) => {
        commit('setContributors', result.data);
        resolve(result.data);
      }).catch((err) => {
        reject(err);
      });
    });
  },
  fetchDelegators({ commit }) {
    return new Promise((resolve, reject) => {
      axios.get(`https://api.the-magic-frog.com/delegators?account=${Vue.prototype.$account}`).then((result) => {
        commit('setDelegators', result.data);
        resolve(result.data);
      }).catch((err) => {
        reject(err);
      });
    });
  },
  fetchCurators({ commit }) {
    return new Promise((resolve, reject) => {
      // Getting the top 12 curators of the frog account
      axios.get(`https://api.the-magic-frog.com/curators?top=100&account=${Vue.prototype.$account}`).then((result) => {
        commit('setCurators', result.data);
        resolve(result.data);
      }).catch((err) => {
        reject(err);
      });
    });
  },
  fetchRsharesToSBDFactor({ commit }) {
    return new Promise((resolve, reject) => {
      // get reward fund for posts
      steem.api.getRewardFund('post', (err, fund) => {
        if (err) reject(err);
        else {
          const rewardBalance = parseFloat(fund.reward_balance.replace(' STEEM', ''));
          const recentClaims = parseInt(fund.recent_claims);

          // get SBD price factor
          steem.api.getCurrentMedianHistoryPrice((err, price) => {
            if (err) reject(err);
            else {
              const SBDPrice = parseFloat(price.base.replace(' SBD', ''));
              const rsharesToSBDFactor = rewardBalance / recentClaims * SBDPrice;

              // final rshares to SBD factor
              commit('setRsharesToSBDFactor', rsharesToSBDFactor);
              resolve(rsharesToSBDFactor);
            }
          });
        }
      });
    });
  },
};
