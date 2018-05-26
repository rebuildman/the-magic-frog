<template>
  <div>
    <b-modal id="whatIsThisModal" size="lg" hide-footer title="What is this?">
      <p>
        On this website you can take part in a collaborative story. Everyone can submit the next little piece of the story and the community decides every day, through voting, which part gets appended. You can therefore submit something everyday. If your submission makes it into the story, you have a chance to win the story pot. The more you can contribute to the story, the higher your chances are.<br>
        <br>
        Utilizing the <a href="https://steem.io" target="_blank"><i>STEEM blockchain</i></a>, this website generates <i>Cryptocurrency</i>, everytime the story proceeds. Those coins are collected in the story pot and released everytime a story ends. It's also up to you, when this will happen. After the first 10 days of each story, you will be able to suggest to end the story. If the community agrees, a new story will start the next day and the current pot will be raffled among all contributors.<br>
        <br>
        Even if you don't make it into the story, you will earn a tiny little bit of STEEM cryptocurrency, everytime you submit something, no matter if the community decides to append it or not.<br>
        <br>
        The first story is about the Magic Frog and his Master Wizard.
      </p>
      <h5 class="my-4"><a href="https://steemit.com/introduceyourself/@the-magic-frog/this-is-the-magic-story-machine-help-the-not-so-magic-frog-collaborative-storytelling-click-it-there-s-money-to-win" target="_blank">Read the intro.</a></h5>
      <p>
        Once this initial story is finished, all future stories will start with „Once upon a time,...“ and from there on it's up to you and the community.<br>
        <br>
        <b>There are no specific rules but please try to be constructive, positive and respectful! The stories can be serious, funny, weird or total nonsense. That's up to you! ;)</b>
      </p>
      <h4 class="mt-4">Have Fun!</h4>
    </b-modal>

    <b-modal id="scRedirectModal" title="Login with SteemConnect">
      In order to participate you need a Steem account. You will be redirected to SteemConnect to authenticate to the Steem blockchain. SteemConnect is developed and maintained by Steemit, Inc. and Busy.org.
      <div slot="modal-footer" class="w-100 text-center">
        <a :href="loginUrl" class="btn btn-primary">Login with SteemConnect</a>
      </div>
    </b-modal>

    <b-modal id="steemSignupModal" title="Create a Steem account">
      In order to participate you need a Steem account. Steem is a blockchain platform that rewards content creators with the cryptocurrency STEEM. Once your Steem account has been verified and enabled, you can use it to log in.<br>
      <br>
      There are a lot more interesting apps and websites you can access with this account. You'll probably need one sooner or later anyway, so don't hesitate... it's free!<br>
      <br>
      <a href="https://steem.io/" target="_blank">Learn more about Steem!</a>
      <div class="alert alert-info mt-4">
        <b>IMPORTANT NOTE:</b><br><br>Due to the decentralized nature of the Steem platform, there is no central authority you can ask to recover your account in case you lose access to it.<br>
        <br>
        Choose a <b>secure password</b> and make sure you <b>keep it safe</b>. Ideally you simply write it down on a piece of paper and store in a safe place.<br>
        <br>
        <b>You have full responsibility for the security of your account and the rewards you earn.</b>
      </div>
      You will be redirected to the sign-up process of steemit.com.
      <div slot="modal-footer" class="w-100 text-center">
        <a href="https://signup.steemit.com/?ref=the-magic-frog" class="btn btn-primary">Create a Steem account</a>
      </div>
    </b-modal>

    <b-modal id="userModal" title="Wallet" v-if="user" hide-footer>
      <div class="alert alert-info text-center">
        Here you will soon be able to access and manage all your STEEM funds. In the meantime, you can access your wallet here:
        <h4><a :href="'https://steemit.com/@' + user.name + '/transfers'" target="_blank">steemit.com</a></h4>
      </div>
      <h4>Your Account Balance</h4>
      <div class="text-center">
        {{ user.account.balance }}<br>
        {{ user.account.sbd_balance }}
      </div>
    </b-modal>

    <b-modal id="transferModal" title="Transfer" ref="transferModalRef" hide-footer>
      <b-form >
        <b-row>
          <b-col sm="3"><label for="SBD">To :</label><br></b-col>
          <b-col sm="9"><b-form-input v-model="reciever" placeholder="reciever e.g. aneilpatel"></b-form-input></b-col>
        </b-row>
        <b-row>
          <b-col sm="3"><label for="SBD">Amount :</label><br></b-col>
          <b-col sm="9"><b-form-input v-model="amount" placeholder="X.XXX"></b-form-input></b-col>
        </b-row>
        <b-row>
          <b-col sm="3"><label for="SBD">Currency :</label><br></b-col>
          <b-col sm="9"><b-form-radio-group id="cureency"
                          buttons
                          button-variant="outline-primary"
                          size="md"
                          v-model="currency"
                          :options="options"
                          name="currency" />
          </b-col>
        </b-row>
        <b-row>
          <b-col sm="3"><label for="SBD">Memo :</label><br></b-col>
          <b-col sm="9"><b-form-textarea v-model="memo" placeholder="memo" rows="3"></b-form-textarea></b-col>
        </b-row>
        <br>
        <div class="b-row text-center" @click="hideModal">
        <a class="btn btn-primary " :href="transferUrl" target="_blank"  > Send </a>
        </div>
      </b-form>
  </b-modal>
  </div>
</template>

<script>

  export default {
    props: ['user', 'loginUrl'],
    data: function(){
      return {
        reciever:"",
        amount:0.001,
        currency:"SBD",
        memo:"  -sent via the-magic-frog! ",
        options: [
        { text: 'STEEM', value: 'STEEM' },
        { text: 'SBD', value: 'SBD' }
      ]
              }
    },
    computed:{
      transferUrl:function(){
      return "https://v2.steemconnect.com/sign/transfer?to="+this.reciever+"&amount="+this.amount+"%20"+this.currency+"&memo="+this.memo;

      } 
    },
    methods:{
      hideModal () {
      this.$refs.transferModalRef.hide()
    },
    
    }

  };
</script>