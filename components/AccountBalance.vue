<template>
  <b-container class="text-center">
    <p class="mb-0">{{ $t('wallet.balance.youhave') }}:</p>
    <h2>{{ user.account.balance }}</h2>
    <h2>{{ user.account.sbd_balance }}</h2>
    <p class="mt-4 mb-0">{{ $t('wallet.balance.estimatedvalue') }}:</p>
    <h3 class="mt-0">$ {{ estimatedValue }}</h3>
    <b-btn v-b-modal.transferModal variant="primary" class="mt-3">{{ $t('wallet.balance.transferbutton') }}</b-btn>
  </b-container>
</template>
<script>
  import axios from 'axios'

  export default {
    props: ['user'],
    data() {
      return {
        steemPrice: 0,
        sbdPrice: 0
      }
    },
    computed: {
      estimatedValue() {
        let steemBalance = parseFloat(this.user.account.balance.replace(' STEEM', ''));
        let sbdBalance = parseFloat(this.user.account.sbd_balance.replace(' SBD', ''));

        return ((steemBalance * this.steemPrice) + (sbdBalance * this.sbdPrice)).toFixed(2);
      }
    },
    mounted() {
      // getting steem price (cmc id 1230)
      axios.get('https://api.coinmarketcap.com/v2/ticker/1230/').then(steemPrice => {
        // getting sbd price (cmc id 1312)
        axios.get('https://api.coinmarketcap.com/v2/ticker/1312/').then(sbdPrice => {
          this.steemPrice = steemPrice.data.data.quotes.USD.price;
          this.sbdPrice = sbdPrice.data.data.quotes.USD.price;
        }).catch((err) => {
          console.log(err);
        });
      }).catch((err) => {
        console.log(err);
      });
    }
  }
</script>
