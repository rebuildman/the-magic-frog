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

    <b-modal id="langModal" :title="$t('langmodal.title')" hide-footer size="sm">
      <b-row>
        <b-col sm="3" v-for="(lang, index) in langs" :lang="lang" :key="index" class="text-center mb-3">
          <a :href="'https://' + (lang == 'en' ? '' : lang + '.') + 'the-magic-frog.com'" class="lang-link">
            <img :src="'/flags/' + lang + '.svg'" class="img-fluid rounded-circle"/><br>
            {{ lang }}
          </a>
        </b-col>
        <b-col sm="3" v-for="(lang, index) in disabledLangs" :lang="lang" :key="index" class="text-center mb-3">
          <span class="lang-link-disabled">
            <img :src="'/flags/' + lang + '.svg'" class="img-fluid rounded-circle"/><br>
            {{ lang }}
          </span>
        </b-col>
      </b-row>
      <p class="my-0 text-center"><i>{{ $t('langmodal.text') }}</i></p>
    </b-modal>
  </div>
</template>

<script>
  export default {
    props: ['user', 'loginUrl'],
    computed: {
      langs() {
        return Object.keys(this.$i18n.messages).filter(lang => lang !== this.$i18n.locale && this.disabledLangs.indexOf(lang) === -1);
      },
      disabledLangs() {
        return ['in', 'ru', 'cn', 'es'];
      }
    }
  };
</script>

<style lang="sass">
  .lang-link
    color: #000
    font-family: 'Berkshire Swash', cursive
    text-transform: uppercase
    &:hover
      text-decoration: none
    img
      transition: transform .5s cubic-bezier(0.68, -0.8, 0.265, 2)
      &:hover
        transform: scale(1.2)
  .lang-link-disabled
    color: #aaa
    font-family: 'Berkshire Swash', cursive
    text-transform: uppercase
    img
      -webkit-filter: grayscale(100%)
      filter: grayscale(100%)
      opacity: .5
</style>
