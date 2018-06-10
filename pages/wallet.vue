<template>
  <section>
    <NavbarLoggedIn v-if="user" :user="user" @logout="logoutAndGoHome" />
    <NavbarLoggedOut v-else/>
    <b-container>
      <h1 class="my-5">Wallet</h1>
      <AccountBalance :user="user"/>
      <div>
        <h1 class="my-5">Transfer History</h1>
      </div>
      <div class="container">
        <table class="table">
          <thead>
          <tr>
            <th>from</th>
            <th>to</th>
            <th>amount</th>
            <th>memo</th>
          </tr>
          </thead>
          <tbody>
          <Transfer v-for="(transfer,index) in transfers" :key="index" :transfer="transfer" :index="index"/>
          </tbody>
        </table>
      </div>
    </b-container>
    <Footer />
    <Modals :loginUrl="loginUrl"/>
  </section>
</template>

<script>
  import steem from 'steem'
  import sc2 from 'sc2-sdk'

  import NavbarLoggedIn from '~/components/NavbarLoggedIn'
  import NavbarLoggedOut from '~/components/NavbarLoggedOut'
  import Modals from '~/components/Modals'
  import AccountBalance from '~/components/AccountBalance'
  import Transfer from '~/components/Transfer'

  import SteemConnect from '~/mixins/SteemConnect'

  export default {
    components: {
      NavbarLoggedIn,
      NavbarLoggedOut,
      Modals,
      AccountBalance,
      Transfer
    },
    mixins: [SteemConnect],
    data() {
      return {
        user: null,
        transfer: {}
      }
    },
    async asyncData() {
      const getTransfers = function (account) {
        return new Promise((resolve, reject) => {
          steem.api.getAccountHistory(account, -1, 1000, (err, res) => {
            if (!err) {
              res = res.filter(tx => tx[1].op[0] === "transfer");
              res = res.reverse();
              resolve(res);
            } else {
              reject(err);
            }
          });
        });
      };

      let allTransfers = [];
      let transfers;

      transfers = await getTransfers("aneilpatel");

      for (let i = 0; i < transfers.length; i++) {
        allTransfers.push(transfers[i]);
      }

      return {transfers: allTransfers};

    },
    methods: {
      logoutAndGoHome() {
        this.$router.push({ name: 'index' });
        this.logout();
      }
    },
    mounted() {
      this.login();
    }
  }
</script>
