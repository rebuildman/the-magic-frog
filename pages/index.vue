<template>
  <section class="container">
    <Navbar />
    <b-container>
      <div class="text-center py-5">
        <img src="/avatar.png" alt=""/>
        <h1 class="pt-4">The Magic Frog</h1>
        <h2>And The Magic Story Machine</h2>
        <p class="lead pt-5">
          Help the magic frog to remember all his interesting an fun stories by feeding the Magic Story Machine with your ideas how the story could go on! The machine then calculates the most likely (or funniest) answer and generates some golden coins for you to win, whenever a story is completed. You might even find some coins yourself just by taking part.
        </p>
        <h4 class="pt-5 pb-3">A Pot Full Of Gold</h4>
        <img src="/pot.png" alt=""/>
        <h5>Current Value:</h5>
        <h2>$ {{ potValue }}</h2>
        <h5>Participants: {{ participants }}</h5>
      </div>

      <div class="py-5">
        <div class="text-center">
          <h2>Read the current story</h2>
          <img src="/divider.png" alt="" class="img-fluid"/>
          <div id="currentStory" class="text-center" v-html="currentStoryBody"></div>
          <img src="/divider.png" alt="" class="rotate-180 img-fluid"/>
          <div>
            <a href="#" class="btn btn-primary btn-lg like-button">
              <svg viewBox="0 0 24 24">
                <path d="M5,9V21H1V9H5M9,21A2,2 0 0,1 7,19V9C7,8.45 7.22,7.95 7.59,7.59L14.17,1L15.23,2.06C15.5,2.33 15.67,2.7 15.67,3.11L15.64,3.43L14.69,8H21C22.11,8 23,8.9 23,10V12C23,12.26 22.95,12.5 22.86,12.73L19.84,19.78C19.54,20.5 18.83,21 18,21H9M9,19H18.03L21,12V10H12.21L13.34,4.68L9,9.03V19Z" />
              </svg>
              I like!
            </a>
          </div>
        </div>
      </div>

      <div class="mx-auto mb-4" style="max-width: 800px;">
        <h2 class="pt-5">How will the story go on?</h2>
        <p class="text-center mt-4">First, read how others see the story evolve and give them your vote if you like it.</p>

        <div id="comments">
          <div class="comment text-center">
            <div class="comment-profile-image" style="background-image: url('https://steemitimages.com/u/hennifant/avatar/small');"></div>
            <div class="comment-username"><a href="#" target="_blank">@hennifant</a> wrote:</div>
            <div class="comment-content">„what caught the attention of the high council of suspicious and insatiable storks in the neighborhood“</div>
            <a href="#" class="btn btn-primary btn-sm like-button">
              <svg viewBox="0 0 24 24">
                <path d="M5,9V21H1V9H5M9,21A2,2 0 0,1 7,19V9C7,8.45 7.22,7.95 7.59,7.59L14.17,1L15.23,2.06C15.5,2.33 15.67,2.7 15.67,3.11L15.64,3.43L14.69,8H21C22.11,8 23,8.9 23,10V12C23,12.26 22.95,12.5 22.86,12.73L19.84,19.78C19.54,20.5 18.83,21 18,21H9M9,19H18.03L21,12V10H12.21L13.34,4.68L9,9.03V19Z" />
              </svg>
              I like!
            </a>
          </div>
          <div class="comment text-center">
            <div class="comment-profile-image" style="background-image: url('https://steemitimages.com/u/hennifant/avatar/small');"></div>
            <div class="comment-username"><a href="#" target="_blank">@hennifant</a> wrote:</div>
            <div class="comment-content">„what caught the attention of the high council of suspicious and insatiable storks in the neighborhood“</div>
            <a href="#" class="btn btn-primary btn-sm like-button">
              <svg viewBox="0 0 24 24">
                <path d="M5,9V21H1V9H5M9,21A2,2 0 0,1 7,19V9C7,8.45 7.22,7.95 7.59,7.59L14.17,1L15.23,2.06C15.5,2.33 15.67,2.7 15.67,3.11L15.64,3.43L14.69,8H21C22.11,8 23,8.9 23,10V12C23,12.26 22.95,12.5 22.86,12.73L19.84,19.78C19.54,20.5 18.83,21 18,21H9M9,19H18.03L21,12V10H12.21L13.34,4.68L9,9.03V19Z" />
              </svg>
              I like!
            </a>
          </div>
        </div>

        <h2 class="pt-5">Now it's your turn!</h2>
        <p class="text-center mt-4">Continue writing the story where it stopped, so that it is funny or exciting to read and maybe even makes a bit of sense. Be creative!</p>

        <form class="mt-4 p-3 mx-auto" id="command-form" style="max-width: 500px;">
          <input class="w-100" id="command" placeholder="And they lived happily ever after..." />
          <sup class="d-block text-center pt-3"><span id="command-char-count">100</span> characters left.</sup>
          <p class="text-center mt-4 mb-1">
            No, I don't want this story to be continued!<br>
            <a href="#" class="btn btn-outline-danger mt-3">Stop it!</a>
          </p>
          <p class="text-center mt-4 mb-1">Here you can add a personal note if you want:</p>
          <textarea class="w-100" placeholder="What an amazing story!"></textarea>
          <button class="btn btn-primary d-block w-100 mt-3">Submit!</button>
        </form>
      </div>
    </b-container>
  </section>
</template>

<script>
import Navbar from '~/components/Navbar'
import steem from 'steem'

const marked = require('marked');

export default {
  components: {
    Navbar
  },
  data() {
    return {
      potValue: 0,
      participants: 0,
      currentStoryBody: ''
    }
  },
  mounted() {
    this.setStoryPotStats(1);
    this.setCurrentStory();
  },
  methods: {
    setStoryPotStats(storyNumber) {
      this.getPostsByStoryNumber('the-magic-frog', storyNumber).then(posts => {
        this.participants = posts.length;
        let storyPot = 0;
        for (let i = 0; i < posts.length; i++) {
          storyPot += this.getPostPot(posts[i]);
        }
        this.potValue = storyPot.toFixed(2);
      });
    },
    setCurrentStory() {
      steem.api.getDiscussionsByBlog({tag: 'the-magic-frog', limit: 10}, (err, posts) => {
        if (!err) {
          for (let i = 0; i < posts.length; i++) {
            let post = posts[i];
            let meta = JSON.parse(post.json_metadata);
            if (meta.hasOwnProperty('day') && meta.hasOwnProperty('storyNumber')) {
              this.currentStoryBody = marked(this.getStoryPart(post.body));
              return;
            }
          }
          console.log('No story posts found in the last 10 posts.');
        } else {
          console.log(err);
        }
      });
    },
    getPostsByStoryNumber(accountName, storyNumber) {
      return new Promise((resolve, reject) => {
        let storyPosts = [];
        let query = {tag: accountName, limit: 100};
        steem.api.getDiscussionsByBlog(query, (err, posts) => {
          if (err) {
            reject(err);
          } else {
            for (let i = 0; i < posts.length; i++) {
              let post = posts[i];
              let meta = JSON.parse(post.json_metadata);
              if (meta.hasOwnProperty('day') && meta.hasOwnProperty('storyNumber') && parseInt(meta.storyNumber) === storyNumber) {
                storyPosts.push(post);
              }
            }
            resolve(storyPosts.reverse())
          }
        });
      })
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
    }
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

  .like-button
    svg
      width: 16px
      vertical-align: middle
      path
        fill: #fff

  input,
  textarea
    border-radius: 5px
    border: solid 2px #ccc
    font-size: 1.2rem
    padding: 5px 10px
    box-shadow: inset 0 -3px 5px rgba(0, 0, 0, .1)

  p
    font-weight: 300

  #currentStory,
  #currentStory p
    font-weight: normal

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
</style>
