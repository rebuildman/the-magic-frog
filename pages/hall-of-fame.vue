<template>
  <section>
    <NavbarLoggedIn v-if="user" :user="user" @logout="logout" />
    <NavbarLoggedOut v-else />
    <b-container>
      <h1 class="my-5">{{ $t('halloffame.title') }}</h1>
      <h2 v-if="delegators.length">{{ $t('halloffame.sponsors') }}</h2>
      <b-row v-if="delegators.length">
        <Delegator v-for="(delegator, index) in delegators" :key="index" :index="index" :delegator="delegator" />
      </b-row>
      <h2 v-if="delegators.length">{{ $t('halloffame.storytellers') }}</h2>
      <b-row>
        <Contributor v-for="(contributor, index) in contributors" :key="index" :index="index" :contributor="contributor" />
      </b-row>
    </b-container>
    <Footer />
    <Modals :loginUrl="loginUrl" :user="user" />
  </section>
</template>

<script>
  import axios from 'axios'

  import NavbarLoggedIn from '~/components/NavbarLoggedIn'
  import NavbarLoggedOut from '~/components/NavbarLoggedOut'
  import Footer from '~/components/Footer'
  import Modals from '~/components/Modals'
  import Contributor from '~/components/Contributor'
  import Delegator from '~/components/Delegator'

  import SteemConnect from '~/mixins/SteemConnect'

  export default {
    components: {
      NavbarLoggedIn,
      NavbarLoggedOut,
      Footer,
      Modals,
      Contributor,
      Delegator
    },
    mixins: [SteemConnect],
    head() {
      return { 
        title: this.$t('index.themagicfrog'),
        meta: [
          { hid: 'description', name: 'description', content: this.$t('index.description') }
        ] 
      }
    },
    data() {
      return {
        user: null
      }
    },
    async asyncData(context) {
      // get all delegators for frog account
      const getDelegators = () => {
        return new Promise((resolve, reject) => {
          axios.get('https://api.the-magic-frog.com/delegators?account=' + context.app.account).then((result) => {
            resolve(result.data);
          }).catch((err) => {
            reject(err);
          });
        });
      };
      let delegators = await getDelegators();

      // get contributors
      const getContributors = () => {
        return new Promise((resolve, reject) => {
          axios.get('https://api.the-magic-frog.com/contributors?account=' + context.app.account).then((result) => {
            resolve(result.data);
          }).catch((err) => {
            reject(err);
          });
        });
      };
      let contributors = await getContributors();

      return { delegators, contributors };
    },
    mounted() {
      this.login();
    }
  }
</script>
