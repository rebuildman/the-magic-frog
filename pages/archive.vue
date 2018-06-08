<template>
  <section>
    <NavbarLoggedIn v-if="user" :user="user" />
    <NavbarLoggedOut v-else />
    <b-container>
      <h1 class="my-5">{{ $t('archive.title') }}</h1>
      <b-row>
        <ArchivedStory v-for="(story, index) in stories" :key="index" :story="story" />
      </b-row>
    </b-container>
    <Footer />
    <Modals :user="user" :loginUrl="loginUrl" />
  </section>
</template>

<script>
  import marked from 'marked'
  import steem from 'steem'
  import sc2 from 'sc2-sdk'
  import axios from 'axios'
  import Cookies from 'js-cookie'

  import NavbarLoggedIn from '~/components/NavbarLoggedIn'
  import NavbarLoggedOut from '~/components/NavbarLoggedOut'
  import Footer from '~/components/Footer'
  import Modals from '~/components/Modals'
  import ArchivedStory from '~/components/ArchivedStory'

  export default {
    components: {
      NavbarLoggedIn,
      NavbarLoggedOut,
      Footer,
      Modals,
      ArchivedStory
    },
    data() {
      return {
        user: null
      }
    },
    async asyncData(context) {
      // get all stories for frog account (last post from each story)
      const getStories = () => {
        return new Promise((resolve, reject) => {
          axios.get('https://api.the-magic-frog.com/stories?account=' + context.app.account).then((result) => {
            resolve(result.data);
          }).catch((err) => {
            reject(err);
          });
        });
      };
      let stories = await getStories();

      return { stories };
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