<template>
  <div class="d-inline-block">
    <b-button :size="size" variant="primary" class="like-button" @click="vote(10000)" v-if="!hasVoted">
      <svg viewBox="0 0 24 24" v-if="!loading">
        <path d="M5,9V21H1V9H5M9,21A2,2 0 0,1 7,19V9C7,8.45 7.22,7.95 7.59,7.59L14.17,1L15.23,2.06C15.5,2.33 15.67,2.7 15.67,3.11L15.64,3.43L14.69,8H21C22.11,8 23,8.9 23,10V12C23,12.26 22.95,12.5 22.86,12.73L19.84,19.78C19.54,20.5 18.83,21 18,21H9M9,19H18.03L21,12V10H12.21L13.34,4.68L9,9.03V19Z" />
      </svg>
      <svg class="spinner" viewBox="0 0 24 24" v-else>
        <path d="M12,4V2A10,10 0 0,0 2,12H4A8,8 0 0,1 12,4Z" />
      </svg>
      I like!
    </b-button>

    <b-button :size="size" variant="secondary" class="like-button" @click="vote(0)" v-else>
      <svg viewBox="0 0 24 24" v-if="!loading">
        <path d="M12,2A10,10 0 0,1 22,12A10,10 0 0,1 12,22A10,10 0 0,1 2,12A10,10 0 0,1 12,2M12,4A8,8 0 0,0 4,12C4,13.85 4.63,15.55 5.68,16.91L16.91,5.68C15.55,4.63 13.85,4 12,4M12,20A8,8 0 0,0 20,12C20,10.15 19.37,8.45 18.32,7.09L7.09,18.32C8.45,19.37 10.15,20 12,20Z" />
      </svg>
      <svg class="spinner" viewBox="0 0 24 24" v-else>
        <path d="M12,4V2A10,10 0 0,0 2,12H4A8,8 0 0,1 12,4Z" />
      </svg>
      I don't like!
    </b-button>
  </div>
</template>

<script>
  import steem from 'steem'

  export default {
    props: ['size', 'user', 'author', 'permlink'],
    data() {
      return {
        loading: false,
        votes: [],
        hasVoted: false
      }
    },
    methods: {
      vote(weight) {
        this.loading = true;
        this.$parent.sc2.vote(this.user.name, this.author, this.permlink, weight, (err) => {
          if (err) {
            console.log(err);
          } else {
            this.hasVoted = weight > 0;
            steem.api.getActiveVotes(this.author, this.permlink, (err, votes) => {
              if (err) {
                console.log(err);
              } else {
                this.loading = false;
                this.votes = votes;
              }
            });
          }
        });
      }
    },
    mounted() {
      steem.api.getActiveVotes(this.author, this.permlink, (err, votes) => {
        if (err) {
          console.log(err);
        } else {
          this.votes = votes;
          for (let i = 0; i < this.votes.length; i++) {
            if (this.votes[i].voter === this.user.name && this.votes[i].percent > 0) {
              this.hasVoted = true;
            }
          }
        }
      });
    }
  };
</script>

<style lang="sass">
  .like-button
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
</style>