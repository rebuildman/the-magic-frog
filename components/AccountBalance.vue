<template>
  <b-container v-if="user" class="text-center">
    <p>You have:</p>
    <h2>{{ user.account.balance }}</h2>
    <h2>{{ user.account.sbd_balance }}</h2>
    <b-btn v-b-modal.transferModal variant="success" class="mt-3">Transfer</b-btn>
  </b-container>
  <div class="upload-spinner" v-else>
    <div class="dot1"></div>
    <div class="dot2"></div>
  </div>
</template>
<script>
  export default {
    props: ['user']
  }
</script>
