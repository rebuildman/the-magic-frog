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
      // used in while loop below to get all posts
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

          // the last post of one iteration and the first of the next iteration are the same, so we remove duplicates here
          allPosts = allPosts.filter((post, index, self) => self.findIndex(p => p.permlink === post.permlink) === index)
        }

      } while (posts.length === 100);

      allPosts = allPosts.reverse(); // reverse to have oldest post first

      // get all delegators
      const getDelegators = (account) => {
        return new Promise((resolve, reject) => {
          axios.get('https://uploadbeta.com/api/steemit/delegators/?cached&hash=' + process.env.delegatorsApiKey + '&id=' + account).then((result) => {
            resolve(result.data);
          }).catch((err) => {
            reject(err);
          });
        });
      };

      // sort by delegated sp
      const delegators = await getDelegators(context.app.account);
      delegators.sort((a, b) => {
        return a.sp < b.sp;
      });

      return { posts: allPosts, delegators };
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
      stories() {
        let stories = [];
        this.posts.forEach(post => {
          let meta = JSON.parse(post.json_metadata);
          if (post.author === this.$account && meta.hasOwnProperty('day') && meta.hasOwnProperty('storyNumber')) {
            stories[meta.storyNumber - 1] = post;
          }
        });
        return stories;
      },
      allCommands() {
        let allCommands = [];
        this.stories.forEach(storyPost => {
          let meta = JSON.parse(storyPost.json_metadata);
          if (meta.hasOwnProperty('commands') && meta.commands.length) {
            allCommands.push(...meta.commands);
          }
        });
        return allCommands;
      },
      contributors() {
        let contributors = [];
        this.allCommands.forEach(command => {
          let exists = contributors.find(contributor => contributor.name === command.author);
          if (exists) {
            contributors[contributors.indexOf(exists)].contributions += 1;
          } else {
            contributors.push({name: command.author, contributions: 1});
          }
        });
        return contributors.sort((a, b) => {
          if (a.contributions > b.contributions)
            return -1;
          if (a.contributions < b.contributions)
            return 1;
          return 0;
        });
      }
    }
  }
</script>