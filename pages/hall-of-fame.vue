<template>
  <section>
    <NavbarLoggedIn v-if="user" :user="user" />
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
    <Modals :user="user" :loginUrl="loginUrl" />
  </section>
</template>

<script>
  import steem from 'steem'
  import sc2 from 'sc2-sdk'
  import axios from 'axios'
  import Cookies from 'js-cookie'

  import NavbarLoggedIn from '~/components/NavbarLoggedIn'
  import NavbarLoggedOut from '~/components/NavbarLoggedOut'
  import Footer from '~/components/Footer'
  import Modals from '~/components/Modals'
  import Contributor from '~/components/Contributor'
  import Delegator from '~/components/Delegator'

  export default {
    components: {
      NavbarLoggedIn,
      NavbarLoggedOut,
      Footer,
      Modals,
      Contributor,
      Delegator
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
    computed: {
      sc2() {
        const api = sc2.Initialize({
          app: 'themagicfrog.app',
          callbackURL: this.redirectUrl,
          scope: ['vote', 'comment']
        });

        const accessToken = Cookies.get('frog_token');
        if (accessToken) {
          api.setAccessToken(accessToken);
          api.me((err, user) => {
            if (err) {
              console.log(err);
            } else {
              this.user = user;
            }
          });
        }
        return api;
      },
      redirectUrl() {
        if (process.env.NODE_ENV === 'development') {
          return process.env.scheme + '://' + process.env.host + (process.env.port ? ':' + process.env.port : '') + '/auth';
        } else if (this.$i18n.fallbackLocale === this.$i18n.locale) {
          return 'https://the-magic-frog.com/auth'
        }

        return 'https://' + this.$i18n.locale + '.the-magic-frog.com/auth'
      },
      loginUrl() {
        return this.sc2.getLoginURL();
      }
    },
    methods: {
      logout() {
        this.user = null;
        Cookies.remove('frog_token');
        return null;
      }
    }
  }
</script>