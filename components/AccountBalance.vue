<template>
  <b-container v-if="user" class="text-center">
    <p class="mb-0">You have:</p>
    <h2>{{ user.account.balance }}</h2>
    <h2>{{ user.account.sbd_balance }}</h2>
    <p class="mt-4 mb-0">Estimated Value in USD:</p>
    <h3 class="mt-0">$ {{ estimatedValue }}</h3>
    <b-btn v-b-modal.transferModal variant="success" class="mt-3">Transfer</b-btn>
  </b-container>
  <div class="upload-spinner" v-else>
    <div class="dot1"></div>
    <div class="dot2"></div>
  </div>
</template>
<script>
  import axios from 'axios'

  export default {
    props: ['user'],
    data() {
      return {
        estimatingValue: true,
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
      axios.get('https://api.coinmarketcap.com/v2/ticker/1230/').then(result => {
        this.steemPrice = result.data.data.quotes.USD.price;

        // getting sbd price (cmc id 1312)
        axios.get('https://api.coinmarketcap.com/v2/ticker/1312/').then(result => {
          this.sbdPrice = result.data.data.quotes.USD.price;
          this.estimatingValue = false;
        }).catch((err) => {
          console.log(err);
        });
      }).catch((err) => {
        console.log(err);
      });
    }
  }
</script>
