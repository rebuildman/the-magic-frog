<template>
  <div>
    <b-modal id="whatIsThisModal" size="lg" hide-footer :title="$t('thismodal.title')">
      <p v-html="$t('thismodal.text1')"></p>
      <p v-html="$t('thismodal.text2')"></p>
      <p v-html="$t('thismodal.text3')"></p>
      <h4 class="mt-4">{{ $t('thismodal.havefun') }}</h4>
    </b-modal>

    <b-modal id="scRedirectModal" :title="$t('loginmodal.title')">
      <p v-html="$t('loginmodal.text')" class="mb-0"></p>
      <div slot="modal-footer" class="w-100 text-center">
        <a :href="loginUrl" class="btn btn-primary">{{ $t('loginmodal.button') }}</a>
      </div>
    </b-modal>

    <b-modal id="steemSignupModal" :title="$t('signupmodal.title')">
      <p class="mb-0" v-html="$t('signupmodal.text')"></p>
      <div class="alert alert-info mt-4" v-html="$t('signupmodal.note')"></div>
      <p class="mb-0">{{ $t('signupmodal.redirect') }}</p>
      <div slot="modal-footer" class="w-100 text-center">
        <a href="https://signup.steemit.com/?ref=the-magic-frog" class="btn btn-primary">{{ $t('signupmodal.button') }}</a>
      </div>
    </b-modal>

    <b-modal id="userModal" :title="$t('walletmodal.title')" v-if="user" hide-footer>
      <div class="alert alert-info text-center">
        {{ $t('walletmodal.text') }}
        <h4><a :href="'https://steemit.com/@' + user.name + '/transfers'" target="_blank">steemit.com</a></h4>
      </div>
      <h4>{{ $t('walletmodal.yourbalance') }}</h4>
      <div class="text-center">
        {{ user.account.balance }}<br>
        {{ user.account.sbd_balance }}
      </div>
    </b-modal>
  </div>
</template>

<script>

  export default {
    props: ['user', 'loginUrl']
  };
</script>