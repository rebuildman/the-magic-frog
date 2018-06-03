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
      const getPosts = function (account, start_author, start_permlink) {
        return new Promise((resolve, reject) => {
          steem.api.getDiscussionsByBlog({
            tag: account,
            limit: 100,
            start_author: start_author,
            start_permlink: start_permlink
          }, (err, res) => {
            if (!err) {
              resolve(res);
            } else {
              reject(err);
            }
          });
        });
      };

      let allPosts = [];
      let posts;
      let lastPost;
      let startAuthor = null;
      let startPermlink = null;

      do {
        posts = await getPosts(context.app.account, startAuthor, startPermlink);
        if (posts.length) {
          lastPost = posts[posts.length - 1];
          startAuthor = lastPost.author;
          startPermlink = lastPost.permlink;

          for (let i = 0; i < posts.length; i++) {
            allPosts.push(posts[i]);
          }

          allPosts = allPosts.filter((post, index, self) => self.findIndex(p => p.permlink === post.permlink) === index)
        }
      } while (posts.length === 100);

      allPosts = allPosts.reverse(); // reverse to have oldest post first
      return { posts: allPosts };
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
      },
      logout() {
        this.user = null;
        Cookies.remove('frog_token');
        return null;
      },
      stories() {
        let stories = [];
        this.posts.forEach(post => {
          let meta = JSON.parse(post.json_metadata);
          if (post.author === this.$account && meta.hasOwnProperty('day') && meta.hasOwnProperty('storyNumber')) {
            stories[meta.storyNumber - 1] = post;
          }
        });
        return stories;
      }
    }
  }
</script>