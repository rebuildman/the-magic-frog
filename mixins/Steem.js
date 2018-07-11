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
          return res[0];
        }
      });
    },
    getRewardBalance() {
      // get reward fund for posts
      steem.api.getRewardFund(this.getPost, (err, fund) => {
        if (err) console.log(err);
        else {
          return parseFloat(fund.reward_balance.replace(' STEEM', ''));
        }
      });
    },
    getRecentClaims() {
      steem.api.getRewardFund(this.getPost, (err, fund) => {
        if (err) console.log(err);
        else {
          return parseInt(fund.recent_claims);
        }
      });
    },
    getSBDPriceFactor() {
      // get SBD price factor
      steem.api.getFeedHistory((err, feed) => {
        if (err) console.log(err);
        else {
          return parseFloat(feed.current_median_history.base.replace(' SBD', ''));
        }
      });
    },
  },
  methods: {
  }
};

export default Steem;
