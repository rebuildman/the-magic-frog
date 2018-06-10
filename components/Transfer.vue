<template>
  <b-card class="transfer my-3">
    <h5 :style="{ color: color }">{{ operation.amount }}</h5>
    <div class="text-center">
      from
      <a :href="'https://steemit.com/@' + operation.from" target="_blank">{{ username(operation.from) }}</a>
       to
      <a :href="'https://steemit.com/@' + operation.to" target="_blank">{{ username(operation.to) }}</a>
    </div>
    <small class="text-muted text-center d-block mt-3" v-if="operation.memo">Memo:</small>
    <p class="m-0 text-center" v-if="operation.memo">
      {{ operation.memo }}
    </p>
    <small class="text-muted text-center d-block mt-3">{{ date }}</small>
  </b-card>
</template>

<script>
  export default {
    props: ['user', 'transfer'],
    computed: {
      operation() {
        return this.transfer[1].op[1];
      },
      color() {
        return this.operation.from === this.user.name ? '#800' : '#080';
      },
      date() {
        return this.transfer[1].timestamp.replace('T', ' ');
      }
    },
    methods: {
      username(username) {
        return username === this.user.name ? 'you' : '@' + username;
      }
    }
  }
</script>

<style lang="sass">
  .transfer
    font-size: .9em
    .profile-image
      display: inline-block
      vertical-align: middle
      width: 30px
      height: 30px
      background-size: cover
      background-position: center
      border-radius: 50%
      margin: 0 5px 0 0
</style>