import steem from 'steem'

const Steem = {
  computed: {
    getPost() {
      // get latest post from the-magic-frog
      steem.api.getDiscussionsByBlog({
        tag: 'the-magic-frog',
        limit: 1
      }, (err, res) => {
        if (err) console.log(err);
        else {
          let post = res[0];
        }
      });
      return post;
    },
    getRewardBalance() {
      // get reward fund for posts
      steem.api.getRewardFund(this.getPost(), (err, fund) => {
        if (err) console.log(err);
        else {
          const rewardBalance = parseFloat(fund.reward_balance.replace(' STEEM', ''));
        }
      });
      return rewardBalance;
    },
    getRecentClaims() {
      steem.api.getRewardFund(this.getPost(), (err, fund) => {
        if (err) console.log(err);
        else {
          const recentClaims = parseInt(fund.recent_claims);
        }
      });
      return recentClaims;
    },
    getSBDPriceFactor() {
      // get SBD price factor
      steem.api.getFeedHistory((err, feed) => {
        if (err) console.log(err);
        else {
          const SBDPriceFactor = parseFloat(feed.current_median_history.base.replace(' SBD', ''));
        }
      });
      return SBDPriceFactor;
    },
  },
  methods: {
  }
};

export default Steem;
