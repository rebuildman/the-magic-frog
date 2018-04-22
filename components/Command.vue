<template>
  <div class="comment text-center">
    <div class="comment-profile-image" :style="{ backgroundImage: 'url(https://steemitimages.com/u/' + command.author + '/avatar/small)' }"></div>
    <div class="comment-username"><a :href="'https://steemit.com/@' + command.author" target="_blank">{{ command.author }}</a> wrote:</div>
    <div class="comment-command" v-html="append"></div>
    <sub>Comment:</sub><br>
    <div class="comment-comment" v-html="comment" v-if="comment"></div>
    <div>
      <LikeButton @voteCasted="$parent.updateData" size="sm" :user="user" :author="command.author" :permlink="command.permlink" v-if="user" />
      <b-button size="sm" variant="primary" class="login-button" v-b-modal.scRedirectModal v-if="!user">
        <svg viewBox="0 0 24 24">
          <path d="M5,9V21H1V9H5M9,21A2,2 0 0,1 7,19V9C7,8.45 7.22,7.95 7.59,7.59L14.17,1L15.23,2.06C15.5,2.33 15.67,2.7 15.67,3.11L15.64,3.43L14.69,8H21C22.11,8 23,8.9 23,10V12C23,12.26 22.95,12.5 22.86,12.73L19.84,19.78C19.54,20.5 18.83,21 18,21H9M9,19H18.03L21,12V10H12.21L13.34,4.68L9,9.03V19Z" />
        </svg>
        Login to vote!
      </b-button>
    </div>
  </div>
</template>

<script>
  import marked from 'marked'

  import LikeButton from '~/components/LikeButton'

  export default {
    components: {
      LikeButton
    },
    props: ['user', 'command'],
    computed: {
      append() {
        let append = this.command.body.split('\n')[0];
        return marked(append);
      },
      comment() {
        let comment = this.command.body.replace(this.command.body.split('\n')[0], '').trim();
        if (comment) {
          return marked(comment);
        }
        return null;
      },
      sc2() {
        return this.$parent.sc2;
      }
    }
  }
</script>

<style lang="sass">
  .comment
    font-weight: 300
    padding: 25px 0
    border-top: solid 1px #eee

    &:first-child
      border-top: none

    .comment-profile-image
      width: 40px
      height: 40px
      background-size: cover
      background-position: center
      border-radius: 50%
      margin: 0 auto

    .comment-command
      padding: 10px 0
      font-style: italic
      p,
      blockquote
        margin: 0

    .comment-comment
      background: #f8f8f8
      border-radius: 5px
      padding: 5px 10px
      margin-bottom: 10px
      display: inline-block
      color: #888
      p
        margin: 0
</style>