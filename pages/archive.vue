<template>
  <section>
    <NavbarLoggedIn v-if="user" :user="user" @logout="logout" />
    <NavbarLoggedOut v-else />
    <b-container>
      <h1 class="my-5">{{ $t('archive.title') }}</h1>
      <b-row>
        <ArchivedStory v-for="(story, index) in stories" :key="index" :story="story" />
      </b-row>
    </b-container>
    <Footer />
    <Modals :loginUrl="loginUrl" :user="user" />
  </section>
</template>

<script>
  import marked from 'marked'
  import axios from 'axios'

  import NavbarLoggedIn from '~/components/NavbarLoggedIn'
  import NavbarLoggedOut from '~/components/NavbarLoggedOut'
  import Footer from '~/components/Footer'
  import Modals from '~/components/Modals'
  import ArchivedStory from '~/components/ArchivedStory'

  import SteemConnect from '~/mixins/SteemConnect'

  export default {
    components: {
      NavbarLoggedIn,
      NavbarLoggedOut,
      Footer,
      Modals,
      ArchivedStory
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
    mounted() {
      this.login();
    }
  }
</script>
