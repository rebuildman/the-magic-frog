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
          Help the magic frog to remember all his interesting and fun stories by feeding the Magic Story Machine with your ideas how the story could go on! The machine then calculates the most likely (or funniest) answer and generates some golden coins for you to win, whenever a story is completed. You might even find some coins yourself just by taking part.
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
          <div id="currentStory" class="text-center">
            <h1 class="mb-4">{{ latestStoryPostMeta.startPhrase }}</h1>
            <StoryPart v-for="(part, index) in latestStoryPostMeta.commands" :key="index" :part="part" />
            <h3 class="mt-4">{{ latestStoryPostMeta.toBeContinued }}</h3>
          </div>
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

        <form class="mt-4 p-4 mx-auto" id="command-form" style="max-width: 500px;" v-if="user" @submit.prevent="submitComment">
          <div v-if="!endStory">
            <input class="w-100" id="command" placeholder="And they lived happily ever after..." v-model="commandInput" @keyup="limitCommandCharacters" @keydown="limitCommandCharacters" />
            <sup class="d-block text-center text-muted pt-3"><span id="command-char-count">{{ commandCharactersLeft }}</span> characters left.</sup>
            <div v-if="!showImageUpload" class="text-center my-4">
              <p>You can even upload an image if you want.</p>
              <b-button  @click="showImageUpload = true" class="btn btn-outline-success">Yes, upload an image!</b-button>
            </div>
            <div v-if="showImageUpload">
              <p class="text-center my-4">
                <b-alert variant="info"
                         dismissible
                         :show="showImageUploadInfo"
                         @dismissed="showImageUploadInfo=false"
                         class="text-left">
                  Please note that only images under the <a href="https://wiki.creativecommons.org/wiki/CC0" target="_blank">CC0 license</a> can be included in the final story. Preferably you upload only your own work and by doing so you agree to provide it to the <a href="https://wiki.creativecommons.org/wiki/Public_domain" target="_blank">public domain</a>.
                </b-alert>
                <input type="file" v-on:change="onImageChange" class="w-100 d-block" ref="image" />
                <img :src="image" v-if="image" alt="uploaded image" class="img-fluid w-100 uploaded-image" />
                <b-button size="sm" class="btn btn-outline-danger mt-3" @click="resetImage">Changed my mind. No image please!</b-button>
              </p>
              <div class="spinner" v-if="imageIsUploading">
                <div class="dot1"></div>
                <div class="dot2"></div>
              </div>
            </div>
            <hr>
            <p class="text-center mt-4 mb-4" v-if="currentStoryPosts.length > 10">
              No, I think this story should end now!<br>
              <b-button class="btn btn-outline-danger mt-3 the-end-button" @click="endStory = true">The End!</b-button>
            </p>
          </div>
          <div v-if="endStory" class="text-center mb-4">
            <h3><i>The End!</i></h3>
            <sup>If the community thinks the same, the pot ($ {{ potValue }}) will be distributed to all participants (including you) and a new story will start!</sup><br>
            <b-button class="btn btn-outline-success mt-3" @click="endStory = false">No, just kidding....</b-button>
          </div>
          <hr>
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
      <p>
        On this website you can take part in a collaborative story. Everyone can submit the next little piece of the story and the community decides every day, through voting, which part gets appended. You can therefore submit something everyday. If your submission makes it into the story, you have a chance to win the story pot. The more you can contribute to the story, the higher your chances are.<br>
        <br>
        Utilizing the <a href="https://steem.io" target="_blank"><i>STEEM blockchain</i></a>, this website generates <i>Cryptocurrency</i>, everytime the story proceeds. Those coins are collected in the story pot and released everytime a story ends. It's also up to you, when this will happen. After the first 10 days of each story, you will be able to suggest to end the story. If the community agrees, a new story will start the next day and the current pot will be raffled among all contributors.<br>
        <br>
        Even if you don't make it into the story, you will earn a tiny little bit of STEEM cryptocurrency, everytime you submit something, no matter if the community decides to append it or not.<br>
        <br>
        The first story is about the Magic Frog and his Master Wizard.
      </p>
      <h5 class="my-4"><a href="https://steemit.com/introduceyourself/@the-magic-frog/this-is-the-magic-story-machine-help-the-not-so-magic-frog-collaborative-storytelling-click-it-there-s-money-to-win" target="_blank">Read the intro.</a></h5>
      <p>
        Once this initial story is finished, all future stories will start with „Once upon a time,...“ and from there on it's up to you and the community.<br>
        <br>
        <b>There are no specific rules but please try to be constructive, positive and respectful! The stories can be serious, funny, weird or total nonsense. That's up to you! ;)</b>
      </p>
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
import axios from 'axios'
import steem from 'steem'
import sc2 from 'sc2-sdk'
import marked from 'marked'
import Cookies from 'js-cookie'

import NavbarLoggedIn from '~/components/NavbarLoggedIn'
import NavbarLoggedOut from '~/components/NavbarLoggedOut'
import LikeButton from '~/components/LikeButton'
import Command from '~/components/Command'
import StoryPart from '~/components/StoryPart'
import Footer from '~/components/Footer'

// TODO: wallet integration
// TODO: edit comments/submissions
// TODO: allow only one "The End!" comment, show upvote button for others

export default {
  components: {
    NavbarLoggedIn,
    NavbarLoggedOut,
    LikeButton,
    Command,
    StoryPart,
    Footer
  },
  data() {
    return {
      user: null,
      endStory: false,
      commandInput: '',
      commentInput: '',
      submitLoading: false,
      showSuccessMessage: false,
      image: null,
      imageIsUploading: false,
      showImageUpload: false,
      showImageUploadInfo: true
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
      pot *= 0.95; // 5 % goes to beneficiaries
      return pot.toFixed(2);
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
      return this.latestStoryPostMeta.storyNumber
    },
    latestStoryPost() {
      return this.allStoryPosts[0];
    },
    latestStoryPostMeta() {
      return JSON.parse(this.latestStoryPost.json_metadata);
    },
    currentCommands() {
      let canEnd = this.latestStoryPostMeta.day > 10;

      return this.comments.filter(comment => {
        if (comment.json_metadata) {
          let meta = JSON.parse(comment.json_metadata);
          return meta.hasOwnProperty('type') && ((meta.type === 'end' && canEnd) || meta.type === 'append');
        }
        return false;
      });
    },
    commandCharactersLeft() {
      return Math.max(250 - this.commandInput.length, 0);
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
      let meta = {
        type: 'append',
        appendText: this.commandInput.trim(),
        comment: this.commentInput.trim(),
        image: this.image,
        author: this.user.name
      };

      if (this.endStory) {
        meta.type = 'end';
        meta.appendText = '# The End!';
      }

      if (meta.appendText || meta.image) {
        let body = '';
        if (meta.appendText) {
          body += '> ' + meta.appendText + '\n\n';
        }

        if (meta.image) {
          body += '> ![image-' + (new Date()).getTime() + '](' + meta.image + ')\n\n';
        }

        if (meta.comment) {
          body += meta.comment;
        }

        let permlink = 're-' + this.latestStoryPost.permlink + '-command-' + (new Date()).getTime();

        this.submitLoading = true;
        this.sc2.comment(
          'the-magic-frog',
          this.latestStoryPost.permlink,
          this.user.name,
          permlink,
          '',
          body,
          meta,
          (err) => {
            if (err) {
              console.log(err);
            } else {
              this.commandInput = '';
              this.commentInput = '';
              this.submitLoading = false;
              this.showSuccessMessage = true;
              this.image = null;
              this.$refs.image.value = null;

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
    },
    onImageChange() {
      // TODO: add validation of filesize and type
      if (!window || !window.File || !window.FileReader || !window.FileList || !window.Blob) {
        alert('The File APIs are not fully supported in this browser.');
        return;
      } else if (!this.$refs.image.files) {
        alert('This browser doesn\'t seem to support the `files` property of file inputs.');
      } else if (!this.$refs.image.files[0]) {
        alert("No file selected.");
      } else {
        let file = this.$refs.image.files[0];

        let fr = new FileReader();
        fr.onload = () => {
          this.imageIsUploading = true;

          let data = fr.result;
          let base64image = data.replace('data:image/png;base64,', '')
            .replace('data:image/jpg;base64,', '')
            .replace('data:image/jpeg;base64,', '')
            .replace('data:image/gif;base64,', '');

          axios({
            method: 'post',
            url: 'https://api.imgur.com/3/image',
            data: {
              image: base64image,
              type: 'base64'
            },
            headers: {
              'Authorization': 'Client-ID a57bbb06e896db0',
              'content-type': 'application/json'
            },
          }).then(result => {
            this.imageIsUploading = false;
            this.image = result.data.data.link;
          });
        };
        fr.readAsDataURL(file);
      }
    },
    resetImage() {
      this.image = null;
      this.showImageUpload = false;
      this.$refs.image.value = null;
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
    background: #fff
    &::placeholder,
    &[type=file]
      color: #ccc

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

    .the-end-button
      font-family: 'Berkshire Swash', cursive

  .pot-value
    font-size: 3rem

  .notifications
    top: 5px !important

  .uploaded-image
    padding: 15px
    border-radius: 5px
    border: solid 1px #eee
    margin-top: 1rem

  .spinner
    margin: 100px auto
    width: 40px
    height: 40px
    position: relative
    text-align: center
    -webkit-animation: sk-rotate 2.0s infinite linear
    animation: sk-rotate 2.0s infinite linear

  .dot1,
  .dot2
    width: 60%
    height: 60%
    display: inline-block
    position: absolute
    top: 0
    background-color: #557F00
    border-radius: 100%
    -webkit-animation: sk-bounce 2.0s infinite ease-in-out
    animation: sk-bounce 2.0s infinite ease-in-out

  .dot2
    background-color: #80b900
    top: auto
    bottom: 0
    -webkit-animation-delay: -1.0s
    animation-delay: -1.0s

  @-webkit-keyframes sk-rotate
    100%
      -webkit-transform: rotate(360deg)

  @keyframes sk-rotate
    100%
      transform: rotate(360deg)
      -webkit-transform: rotate(360deg)

  @-webkit-keyframes sk-bounce
    0%,
    100%
      -webkit-transform: scale(0.0)
    50%
      -webkit-transform: scale(1.0)

  @keyframes sk-bounce
    0%,
    100%
      transform: scale(0.0)
      -webkit-transform: scale(0.0)
    50%
      transform: scale(1.0)
      -webkit-transform: scale(1.0)
</style>
