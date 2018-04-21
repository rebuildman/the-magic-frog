<template>
  <section>
    <NavbarLoggedIn v-if="user" :user="user" />
    <NavbarLoggedOut v-else />
    <b-container>
      <div class="text-center py-5">
        <img src="/avatar.png" alt=""/>
        <h1 class="pt-4">The Magic Frog</h1>
        <h2>And The Magic Story Machine</h2>
        <p class="lead pt-5">
          Help the magic frog to remember all his interesting an fun stories by feeding the Magic Story Machine with your ideas how the story could go on! The machine then calculates the most likely (or funniest) answer and generates some golden coins for you to win, whenever a story is completed. You might even find some coins yourself just by taking part.
        </p>
      </div>

      <div class="text-center pb-5">
        <h2 class="pt-5 pb-3">A Pot Full Of Gold</h2>
        <img src="/pot.png" alt=""/>
        <h5 class="mt-3">Current Value:</h5>
        <h1 class="pot-value">$ {{ potValue }}</h1>

        <div class="my-4">
          <LikeButton @voteCasted="updateData" :user="user" likeLabel="Generate more coins!" unlikeLabel="Coins generated! Undo?" :author="latestStoryPost.author" :permlink="latestStoryPost.permlink" v-if="latestStoryPost && user" />
          <b-button variant="primary" class="login-button" v-b-modal.scRedirectModal v-if="!user">
            <svg viewBox="0 0 24 24">
              <path d="M5,9V21H1V9H5M9,21A2,2 0 0,1 7,19V9C7,8.45 7.22,7.95 7.59,7.59L14.17,1L15.23,2.06C15.5,2.33 15.67,2.7 15.67,3.11L15.64,3.43L14.69,8H21C22.11,8 23,8.9 23,10V12C23,12.26 22.95,12.5 22.86,12.73L19.84,19.78C19.54,20.5 18.83,21 18,21H9M9,19H18.03L21,12V10H12.21L13.34,4.68L9,9.03V19Z" />
            </svg>
            Login to generate more!
          </b-button>
        </div>

        <p class="mt-5">
          Yes, it's totally free to participate and you even get something for it! Isn't that great? And yes, we're talking about money. You might wonder who pays for this. Well, this website is indeed very magical. It's not only about the "magical" stories but also about the magic of technology, the magic of <i>the Blockchain</i> and digital currencies.<br>
          <br>
          This website issues a cryptocurrency called <i>STEEM</i> based on a decentralized community voting process. You can use this currency to give your own votes more weight or sell it for actual money. In a nutshell, STEEM enables you to earn, sell and buy <i>influence</i> in a global, decentralized content network.<br>
          <br>
          The influence of <i>The Magic Frog</i> and the whole STEEM community is used to reward the people that take part in this collaborative storytelling project. The content of the story however is based purely on vote counts and not the influence of the individual.
        </p>
      </div>

      <div class="py-5">
        <div class="text-center">
          <h2>Read the current story</h2>
          <img src="/divider.png" alt="" class="img-fluid"/>
          <div id="currentStory" class="text-center" v-html="currentStoryBody"></div>
          <h3>To be continued...</h3>
          <img src="/divider.png" alt="" class="rotate-180 img-fluid"/>
        </div>
      </div>

      <div class="mx-auto mb-4" style="max-width: 800px;">
        <h2 class="pt-5">How will the story go on?</h2>
        <p class="text-center mt-4">First, read how others see the story evolve and vote for them if you like it.</p>

        <div id="comments">
          <Command v-for="command in currentCommands" :key="command.id" :command="command" :user="user" />
          <p class="text-center" v-if="!currentCommands.length">There are no comments today yet. Be the first one!</p>
        </div>

        <h2 class="pt-5">Now it's your turn!</h2>
        <p class="text-center mt-4">Continue writing the story where it stopped, so that it is funny or exciting to read and maybe even makes a bit of sense. Be creative!</p>

        <form class="mt-4 p-3 mx-auto" id="command-form" style="max-width: 500px;" v-if="user" @submit.prevent="submitComment">
          <div v-if="!endStory">
            <input class="w-100" id="command" placeholder="And they lived happily ever after..." v-model="commandInput" @keyup="limitCommandCharacters" @keydown="limitCommandCharacters" />
            <sup class="d-block text-center pt-3"><span id="command-char-count">{{ commandCharactersLeft }}</span> characters left.</sup>
            <p class="text-center mt-4 mb-1" v-if="currentStoryPosts.length > 10">
              No, I don't want this story to be continued!<br>
              <b-button class="btn btn-outline-danger mt-3" @click="endStory = true">Stop it!</b-button>
            </p>
          </div>
          <div v-if="endStory" class="text-center">
            <h3><i>The End!</i></h3>
            <sup>A new story will start!</sup><br>
            <b-button class="btn btn-outline-success mt-3" @click="endStory = false">No, just kidding....</b-button>
          </div>
          <p class="text-center mt-4 mb-1">Here you can add a personal note if you want:</p>
          <textarea class="w-100" placeholder="What an amazing story!" v-model="commentInput"></textarea>
          <div v-if="showSuccessMessage" class="text-center alert alert-success">
            Thank you for participating!
          </div>
          <button class="btn btn-primary d-block w-100 mt-3" v-if="!showSuccessMessage">
            <svg class="spinner" viewBox="0 0 24 24" v-if="submitLoading">
              <path d="M12,4V2A10,10 0 0,0 2,12H4A8,8 0 0,1 12,4Z" />
            </svg>
            Submit!
          </button>
        </form>
        <div v-if="!user" class="text-center">
          <b-button variant="primary" class="login-button mx-auto" v-b-modal.scRedirectModal>
            <svg viewBox="0 0 24 24">
              <path d="M22,2C22,2 14.36,1.63 8.34,9.88C3.72,16.21 2,22 2,22L3.94,21C5.38,18.5 6.13,17.47 7.54,16C10.07,16.74 12.71,16.65 15,14C13,13.44 11.4,13.57 9.04,13.81C11.69,12 13.5,11.6 16,12L17,10C15.2,9.66 14,9.63 12.22,10.04C14.19,8.65 15.56,7.87 18,8L19.21,6.07C17.65,5.96 16.71,6.13 14.92,6.57C16.53,5.11 18,4.45 20.14,4.32C20.14,4.32 21.19,2.43 22,2Z" />
            </svg>
            Log in to write!
          </b-button>
        </div>
      </div>
    </b-container>

    <Footer />

    <b-modal id="whatIsThisModal" hide-footer title="What is this?">
      On this website you can take part in a collaborative story. Everyone can submit the next little piece of the story and the community decides every day, through voting, which part gets appended. You can therefore submit something everyday. If your submission makes it into the story, you have a chance to win the story pot. The more you can contribute to the story, the higher your chances are.<br>
      <br>
      Utilizing the <a href="https://steem.io" target="_blank"><i>STEEM blockchain</i></a>, this website generates <i>Cryptocurrency</i>, everytime the story proceeds. Those coins are collected in the story pot and released everytime a story ends. It's also up to you, when this will happen. After the first 10 days of each story, you will be able to suggest to end the story. If the community agrees, a new story will start the next day and the current pot will be raffled among all contributors.<br>
      <br>
      Even if you don't make it into the story, you will earn a tiny little bit of STEEM cryptocurrency, everytime you submit something, no matter if the community decides to append it or not.<br>
      <br>
      The first story is about the Magic Frog and his Master Wizard.
      <h5 class="my-4"><a href="https://steemit.com/introduceyourself/@the-magic-frog/this-is-the-magic-story-machine-help-the-not-so-magic-frog-collaborative-storytelling-click-it-there-s-money-to-win" target="_blank">Read the intro.</a></h5>
      Once this initial story is finished, all future stories will start with „Once upon a time,...“ and from there on it's up to you and the community.<br>
      <br>
      <b>There are no specific rules but please try to be constructive, positive and respectful! The stories can be serious, funny, weird or total nonsense. That's up to you! ;)</b>
      <h4 class="mt-4">Have Fun!</h4>
    </b-modal>

    <b-modal id="scRedirectModal" title="Login with SteemConnect">
      In order to participate you need a Steem account. You will be redirected to SteemConnect to authenticate to the Steem blockchain. SteemConnect is developed and maintained by Steemit, Inc. and Busy.org.
      <div slot="modal-footer" class="w-100 text-center">
        <a :href="loginUrl" class="btn btn-primary">Login with SteemConnect</a>
      </div>
    </b-modal>

    <b-modal id="steemSignupModal" title="Create a Steem account">
      In order to participate you need a Steem account. Steem is a blockchain platform that rewards content creators with the cryptocurrency STEEM. Once your Steem account has been verified and enabled, you can use it to log in.<br>
      <br>
      There are a lot more interesting apps and websites you can access with this account. You'll probably need one sooner or later anyway, so don't hesitate... it's free!<br>
      <br>
      <a href="https://steem.io/" target="_blank">Learn more about Steem!</a>
      <div class="alert alert-info mt-4">
        <b>IMPORTANT NOTE:</b><br><br>Due to the decentralized nature of the Steem platform, there is no central authority you can ask to recover your account in case you lose access to it.<br>
        <br>
        Choose a <b>secure password</b> and make sure you <b>keep it safe</b>. Ideally you simply write it down on a piece of paper and store in a safe place.<br>
        <br>
        <b>You have full responsibility for the security of your account and the rewards you earn.</b>
      </div>
      You will be redirected to the sign-up process of steemit.com.
      <div slot="modal-footer" class="w-100 text-center">
        <a href="https://signup.steemit.com/?ref=the-magic-frog" class="btn btn-primary">Create a Steem account</a>
      </div>
    </b-modal>

    <b-modal id="userModal" :title="user.name" v-if="user" hide-footer>
      <div class="alert alert-info text-center">
        Here you will soon be able to access and manage all your STEEM funds. In the meantime, you can access your wallet here:
        <h4><a :href="'https://steemit.com/@' + user.name + '/transfers'" target="_blank">steemit.com</a></h4>
      </div>
      <h4>Your Account Balance</h4>
      <div class="text-center">
        {{ user.account.balance }}<br>
        {{ user.account.sbd_balance }}
      </div>
    </b-modal>

    <notifications group="errors" classes="vue-notification error" position="top center" :duration="8000" />
  </section>
</template>

<script>
import steem from 'steem'
import sc2 from 'sc2-sdk'
import marked from 'marked'
import Cookies from 'js-cookie'

import NavbarLoggedIn from '~/components/NavbarLoggedIn'
import NavbarLoggedOut from '~/components/NavbarLoggedOut'
import LikeButton from '~/components/LikeButton'
import Command from '~/components/Command'
import Footer from '~/components/Footer'

export default {
  components: {
    NavbarLoggedIn,
    NavbarLoggedOut,
    LikeButton,
    Command,
    Footer
  },
  data() {
    return {
      user: null,
      endStory: false,
      commandInput: '',
      commentInput: '',
      submitLoading: false,
      showSuccessMessage: false
    }
  },
  async asyncData() {
    const getPosts = (accountName, limit = 100) => {
      return new Promise((resolve, reject) => {
        steem.api.getDiscussionsByBlog({tag: accountName, limit: limit}, (err, posts) => {
          if (err) {
            reject(err);
          } else {
            resolve(posts);
          }
        });
      });
    };

    const getComments = (accountName, permlink) => {
      return new Promise((resolve, reject) => {
        steem.api.getContentReplies(accountName, permlink, function(err, comments) {
          if (err) {
            reject(err);
          } else {
            resolve(comments);
          }
        });
      });
    };

    let accountName = 'the-magic-frog';
    let posts = await getPosts(accountName);
    let comments = [];
    for (let i = 0; i < posts.length; i++) {
      let meta = JSON.parse(posts[i].json_metadata);
      if (meta.hasOwnProperty('day') && meta.hasOwnProperty('storyNumber')) {
        comments = await getComments(accountName, posts[i].permlink);
        break;
      }
    }

    return { posts, comments }
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
    potValue() {
      let pot = 0;
      for (let i = 0; i < this.currentStoryPosts.length; i++) {
        pot += parseFloat(this.getPostPot(this.currentStoryPosts[i]));
      }
      return pot.toFixed(2);
    },
    participants() {
      let meta = JSON.parse(this.latestStoryPost.json_metadata);
      return meta.hasOwnProperty('participants') ? meta.participants : {};
    },
    participantsCount() {
      return Object.keys(this.participants).length;
    },
    allStoryPosts() {
      return this.posts.filter(post => {
        let meta = JSON.parse(post.json_metadata);
        return meta.hasOwnProperty('day') && meta.hasOwnProperty('storyNumber');
      });
    },
    currentStoryPosts() {
      return this.allStoryPosts.filter(post => {
        let meta = JSON.parse(post.json_metadata);
        return parseInt(meta.storyNumber) === this.currentStoryNumber
      });
    },
    currentStoryNumber() {
      let meta = JSON.parse(this.latestStoryPost.json_metadata);
      return meta.storyNumber
    },
    currentStoryBody() {
      let storyBody = marked(this.getStoryPart(this.latestStoryPost.body));
      storyBody = storyBody.replace(/\(by @([\w-.]+)\)/g, '<br><span class="author">by <a href="https://steemit.com/@$1">@$1</a></span>');
      return storyBody;
    },
    latestStoryPost() {
      return this.allStoryPosts[0];
    },
    currentCommands() {
      return this.comments.filter(comment => {
        let meta = JSON.parse(this.latestStoryPost.json_metadata);
        let command = comment.body.split('\n')[0];
        if (command === '> The End!' && meta.day > 10) {
          return true;
        } else if (command.indexOf('> ') === 0 && command.length <= 252) {
          return true;
        }
        return false;
      });
    },
    commandCharactersLeft() {
      return 250 - this.commandInput.length;
    }
  },
  methods: {
    async updateData() {
      console.log('updated data');
      const getPosts = (accountName, limit = 100) => {
        return new Promise((resolve, reject) => {
          steem.api.getDiscussionsByBlog({tag: accountName, limit: limit}, (err, posts) => {
            if (err) {
              reject(err);
            } else {
              resolve(posts);
            }
          });
        });
      };

      const getComments = (accountName, permlink) => {
        return new Promise((resolve, reject) => {
          steem.api.getContentReplies(accountName, permlink, function(err, comments) {
            if (err) {
              reject(err);
            } else {
              resolve(comments);
            }
          });
        });
      };

      let accountName = 'the-magic-frog';
      let posts = await getPosts(accountName);
      let comments = [];
      for (let i = 0; i < posts.length; i++) {
        let meta = JSON.parse(posts[i].json_metadata);
        if (meta.hasOwnProperty('day') && meta.hasOwnProperty('storyNumber')) {
          comments = await getComments(accountName, posts[i].permlink);
          break;
        }
      }

      this.posts = posts;
      this.comments = comments;
    },
    limitCommandCharacters() {
      this.commandInput = this.commandInput.substr(0, 250);
    },
    getStoryPart(body) {
      const start = body.indexOf('# Once upon a time,');
      const end = body.indexOf('## To be continued!');
      if (start !== -1 && end !== -1) {
        return body.slice(start, end);
      } else {
        console.log('Could not find story part in content. :(');
        return false;
      }
    },
    getPostPot(post) {
      if (post.last_payout === '1970-01-01T00:00:00') {
        return parseFloat(post.pending_payout_value.replace(' SBD', '')) * 0.75 / 2;
      }

      return (parseFloat(post.total_payout_value.replace(' SBD', '')) / 2).toFixed(2);
    },
    logout() {
      this.user = null;
      Cookies.remove('frog_token');
      return null;
    },
    submitComment() {
      let body = null;
      if (this.endStory) {
        body = '> The End!\n\n' + this.commentInput;
      } else if (this.commandInput && this.commandInput.length < 250) {
        body = '> ' + this.commandInput + '\n\n' + this.commentInput;
      }

      if (body) {
        let permlink = 're-' + this.latestStoryPost.permlink + '-command-' + (new Date()).getTime();

        this.submitLoading = true;
        this.sc2.comment(
          'the-magic-frog',
          this.latestStoryPost.permlink,
          this.user.name,
          permlink,
          '',
          body,
          null,
          (err) => {
            if (err) {
              console.log(err);
            } else {
              this.commandInput = '';
              this.commentInput = '';
              this.submitLoading = false;
              this.showSuccessMessage = true;

              steem.api.getContentReplies('the-magic-frog', this.latestStoryPost.permlink, (err, comments) => {
                if (err) {
                  console.log(err);
                } else {
                  this.comments = comments;
                }
              });
            }
          }
        );
      }
    }
  },
  events: {
    onVoteCasted: function () {
      this.updateData();
    },
  }
}
</script>

<style lang="sass">
  *
    outline: none !important

  .green
    color: #557F00

  .green-light
    color: #80BF00

  .green-dark
    color: #2B4000

  a
    color: #557F00

    &:hover
      color: #2B4000

  .btn-primary:not(:disabled):not(.disabled)
    background: #557F00
    border-color: #2B4000

  .btn-primary:not(:disabled):not(.disabled).active,
  .btn-primary:not(:disabled):not(.disabled):active,
  .btn-primary:not(:disabled):not(.disabled):active:focus,
  .btn-primary:not(:disabled):not(.disabled):focus,
  .show > .btn-primary.dropdown-toggle
    background: #2B4000
    border-color: #2B4000
    box-shadow: 0 0 0 0.2rem rgba(128, 191, 0, .5)

  .rotate-180
    transform: rotate(180deg)

  h1, h2, h3, h4, h5
    font-family: 'Berkshire Swash', cursive
    text-align: center

  #currentStory,
  #currentStory p
    font-weight: normal
    font-size: 1.2rem

    .author
      color: #aaa
      font-size: .8rem

  input,
  textarea
    border-radius: 5px
    border: solid 2px #ccc
    font-size: 1.2rem
    padding: 5px 10px
    box-shadow: inset 0 -3px 5px rgba(0, 0, 0, .1)

  p
    font-weight: 300

  .btn
    svg
      width: 16px
      margin-top: -3px
      vertical-align: middle
      path
        fill: #fff
        transition: fill .3s ease
    &.btn-outline-secondary
      color: #aaa
      border-color: #ccc
      svg
        path
          fill: #aaa
      &:hover,
      &:active,
      &:focus
        color: #fff
        background: #ccc
        border-color: #bbb
        svg
          path
            fill: #fff
    &.btn-lg
      line-height: 26px
      svg
        margin-top: -4px
        width: 20px
    &.btn-sm
      line-height: 20px
      svg
        margin-top: -2px
        width: 14px
    .spinner
      animation-name: spin
      animation-duration: 1s
      animation-iteration-count: infinite
      animation-timing-function: linear

      @-moz-keyframes spin
        from
          -moz-transform: rotate(0deg)
        to
          -moz-transform: rotate(360deg)

      @-webkit-keyframes spin
        from
          -webkit-transform: rotate(0deg)
        to
          -webkit-transform: rotate(360deg)

      @keyframes spin
        from
          transform: rotate(0deg)
        to
          transform: rotate(360deg)

  #currentStory,
  #currentStory p
    font-weight: normal

  #currentStory
    h1
      &:first-child
        margin-bottom: 40px

  #command-form
    border: solid 1px #ddd
    border-radius: 10px

  #comments .comment
    font-weight: 300
    padding: 25px 0
    border-top: solid 1px #eee

  #comments .comment:first-child
    border-top: none

  #comments .comment .comment-profile-image
    width: 40px
    height: 40px
    background-size: cover
    background-position: center
    border-radius: 50%
    margin: 0 auto

  #comments .comment .comment-content
    padding: 10px 0
    font-style: italic

  .pot-value
    font-size: 3rem

  .notifications
    top: 5px !important
</style>
