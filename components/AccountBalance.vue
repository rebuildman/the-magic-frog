<template>
  <div class="container" v-if="user">
    <b-row class="text-right d-flex justify-content-between w-100">
      <p>Steem Balance:</p> {{user.account.balance}}
    </b-row>
    <b-row class="text-right d-flex justify-content-between w-100">
      <p>SBD Balance:</p> {{user.account.sbd_balance}}
    </b-row>
    <b-btn class="float-right" v-b-modal.transferModal>Transfer</b-btn>
  </div>
</template>
<script>
  export default {
    props: ['user']
  }
</script>
