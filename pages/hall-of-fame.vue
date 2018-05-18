<template>
  <section>
    <NavbarLoggedIn v-if="user" :user="user" />
    <NavbarLoggedOut v-else />
    <b-container>
      <h1 class="my-5">Hall of Fame</h1>
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
  import Cookies from 'js-cookie'

  import NavbarLoggedIn from '~/components/NavbarLoggedIn'
  import NavbarLoggedOut from '~/components/NavbarLoggedOut'
  import Footer from '~/components/Footer'
  import Modals from '~/components/Modals'
  import Contributor from '~/components/Contributor'

  export default {
    components: {
      NavbarLoggedIn,
      NavbarLoggedOut,
      Footer,
      Modals,
      Contributor
    },
    data() {
      return {
        user: null
      }
    },
    async asyncData() {
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
        posts = await getPosts('the-magic-frog', startAuthor, startPermlink);
        lastPost = posts[posts.length - 1];
        startAuthor = lastPost.author;
        startPermlink = lastPost.permlink;

        for (let i = 0; i < posts.length; i++) {
          allPosts.push(posts[i]);
        }

        allPosts = allPosts.filter((post, index, self) => self.findIndex(p => p.permlink === post.permlink) === index)

      } while (posts.length === 100);

      allPosts = allPosts.reverse(); // reverse to have oldest post first
      return { posts: allPosts };
    },
    computed: {
      sc2() {
        const api = sc2.Initialize({
          app: 'themagicfrog.app',
          callbackURL: process.env.baseUrl + '/auth',
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
      loginUrl() {
        return this.sc2.getLoginURL();
      },
      stories() {
        let stories = [];
        this.posts.forEach(post => {
          let meta = JSON.parse(post.json_metadata);
          if (meta.hasOwnProperty('day') && meta.hasOwnProperty('storyNumber')) {
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