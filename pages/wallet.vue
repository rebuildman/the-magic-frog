<template>
  <section>
    <NavbarLoggedIn v-if="user" :user="user" @logout="logoutAndGoHome" />
    <NavbarLoggedOut v-else/>
    <b-container>
      <h1 class="mt-5 mb-4">{{ $t('wallet.title') }}</h1>
      <div v-if="user">
        <AccountBalance :user="user"/>
        <h2 class="mt-5 mb-4">{{ $t('wallet.history.title') }}</h2>
        <TransferHistory :user="user" />
      </div>
      <div class="upload-spinner" v-else>
        <div class="dot1"></div>
        <div class="dot2"></div>
      </div>
    </b-container>
    <Footer />
    <Modals :loginUrl="loginUrl" :user="user" />
  </section>
</template>

<script>
  import NavbarLoggedIn from '~/components/NavbarLoggedIn'
  import NavbarLoggedOut from '~/components/NavbarLoggedOut'
  import Modals from '~/components/Modals'
  import AccountBalance from '~/components/AccountBalance'
  import TransferHistory from '~/components/TransferHistory'
  import Footer from '~/components/Footer'

  import SteemConnect from '~/mixins/SteemConnect'

  export default {
    components: {
      NavbarLoggedIn,
      NavbarLoggedOut,
      Modals,
      AccountBalance,
      TransferHistory,
      Footer
    },
    mixins: [SteemConnect],
    data() {
      return {
        user: null
      }
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
