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

    <b-modal id="transferModal" title="Transfer" ref="transferModalRef" hide-footer>
      <b-form>
        <b-row>
          <b-col sm="3"><label for="SBD">To:</label><br></b-col>
          <b-col sm="9">
            <b-form-input v-model="reciever" placeholder="reciever e.g. aneilpatel"></b-form-input>
          </b-col>
        </b-row>
        <b-row>
          <b-col sm="3"><label for="SBD">Amount:</label><br></b-col>
          <b-col sm="9">
            <b-form-input v-model="amount" placeholder="0.001"></b-form-input>
          </b-col>
        </b-row>
        <b-row>
          <b-col sm="3"><label for="SBD">Currency:</label><br></b-col>
          <b-col sm="9">
            <b-form-radio-group id="cureency" buttons button-variant="outline-primary" size="md" v-model="currency" :options="options" name="currency"/>
          </b-col>
        </b-row>
        <b-row>
          <b-col sm="3"><label for="SBD">Memo :</label><br></b-col>
          <b-col sm="9">
            <b-form-textarea v-model="memo" placeholder="memo" rows="3"></b-form-textarea>
          </b-col>
        </b-row>
        <br>
        <div class="b-row text-center" @click="hideModal">
          <a class="btn btn-primary " :href="transferUrl" target="_blank"> Send </a>
        </div>
      </b-form>
    </b-modal>

    <b-modal id="langModal" :title="$t('langmodal.title')" hide-footer size="sm">
      <b-row>
        <b-col sm="3" v-for="(lang, index) in langs" :lang="lang" :key="index" class="text-center mb-3">
          <a :href="'https://' + (lang == 'en' ? '' : lang + '.') + 'the-magic-frog.com'" class="lang-link">
            <img :src="'/flags/' + lang + '.svg'" class="img-fluid rounded-circle"/><br>
            {{ lang }}
          </a>
        </b-col>
        <b-col sm="3" v-for="(lang, index) in disabledLangs" :lang="lang" :key="index + 1000" class="text-center mb-3">
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
    data: function(){
      return {
        reciever: '',
        amount: 0.001,
        currency: 'SBD',
        memo: 'Sent via the-magic-frog.com!',
        options: [
          { text: 'STEEM', value: 'STEEM' },
          { text: 'SBD', value: 'SBD' }
        ]
      }
    },
    computed:{
      transferUrl:function(){
        return 'https://v2.steemconnect.com/sign/transfer?to=' + this.reciever + '&amount=' + this.amount + '%20' + this.currency + '&memo=' + this.memo;
      },
      langs() {
        return Object.keys(this.$i18n.messages).filter(lang => lang !== this.$i18n.locale && this.disabledLangs.indexOf(lang) === -1);
      },
      disabledLangs() {
        return ['in', 'ru', 'cn', 'es'];
      }
    },
    methods: {
      hideModal() {
        this.$refs.transferModalRef.hide()
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
