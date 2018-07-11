<template>
  <b-col sm="12" md="4" class="mb-4 d-flex align-items-center justify-content-end flex-column">
    <div class="flex-column">
      <h2>#{{ index + 1 }}</h2>
      <div class="curator-profile-image" :style="{ backgroundImage: 'url(https://steemitimages.com/u/' + curator.voter + '/avatar/large)', width: imageSize + 'px', height: imageSize + 'px' }"></div>
      <h3><a :href="'https://steemit.com/@' + curator.voter" target="_blank">@{{ curator.voter }}</a></h3>
      <h5>{{ $t('halloffame.curated') }}: {{ gestimatedSBD }} SBD</h5>
    </div>
  </b-col>
</template>

<script>

  export default {
    props: ['curator', 'index', 'rsharesToSBDFactor'],
    computed: {
      imageSize() {
        // image size based on position:
        // 1st: 150px, 2nd: 100px, 3rd and following: 50px
        return this.index === 0 ? 150 : (this.index === 1 ? 100 : 50);
      },
      gestimatedSBD() {        
        return (this.curator.rshares * this.getRsharesToSBDFactor).toFixed(3);
      }
    },
  methods: {
    getRsharesToSBDFactor() {
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

                // calculate SBD value for each vote
                resolve(rewardBalance / recentClaims * SBDPrice);
                }
              });
            }
          });
        });
      },
    }
  }
</script>

<style lang="sass">
  .curator-profile-image
    background-size: cover
    background-position: center
    border-radius: 50%
    margin: 0 auto
</style>
