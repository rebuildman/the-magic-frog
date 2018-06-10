<template>
  <div>
    <b-container>
      <Transfer v-for="(transfer, index) in transfers" :key="index" :transfer="transfer" :user="user" />
    </b-container>
    <b-container class="text-center mb-5">
      <b-button @click="loadTransfers" variant="outline-secondary">
        <svg class="spinner" viewBox="0 0 24 24" v-if="loading">
          <path d="M12,4V2A10,10 0 0,0 2,12H4A8,8 0 0,1 12,4Z" />
        </svg>
        <span v-if="loading">Loading...</span>
        <span v-else>Show more!</span>
      </b-button>
    </b-container>
  </div>
</template>

<script>
  import steem from 'steem'

  import Transfer from '~/components/Transfer'

  export default {
    components: {
      Transfer
    },
    props: ['user'],
    data() {
      return {
        transfers: [],
        start: -1,
        limit: 10000,
        loading: false
      }
    },
    methods: {
      loadTransfers() {
        this.loading = true;
        steem.api.getAccountHistory(this.user.name, this.start, this.limit, (err, result) => {
          if (err) {
            console.log(err);
          } else {
            result = result.filter(tx => tx[1].op[0] === 'transfer');
            result.reverse();
            this.transfers.push(...result);
            if (this.start === -1) {
              this.start++;
            }
            this.start += this.limit;
            this.loading = false;
          }
        });
      }
    },
    mounted() {
      this.loadTransfers();
    }
  }
</script>