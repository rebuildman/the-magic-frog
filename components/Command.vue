<template>
  <div class="comment text-center">
    <div class="comment-profile-image" :style="{ backgroundImage: 'url(https://steemitimages.com/u/' + command.author + '/avatar/small)' }"></div>
    <div class="comment-username"><a href="#" target="_blank">{{ command.author }}</a> wrote:</div>
    <div class="comment-content" v-html="commandBody"></div>
    <div>
      <LikeButton size="sm" :user="user" :author="command.author" :permlink="command.permlink" v-if="user" />
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
      commandBody() {
        return marked(this.command.body);
      },
      sc2() {
        return this.$parent.sc2;
      }
    }
  }
</script>