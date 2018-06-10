<template>
  <b-modal id="transferModal" title="Transfer" ref="transferModalRef" hide-footer>
    <b-container>
      <b-alert variant="info"
               dismissible
               :show="true"
               class="text-left">
        Keep in mind that transactions, including all details, such as amount and memo, will be publicly stored on the Steem blockchain!
      </b-alert>
      <b-form>
        <b-form-group id="receiver" label="To:" label-for="receiver" description="Enter a username to which you want to transfer funds.">
          <b-form-input id="receiver" type="text" v-model="receiver" required placeholder="Username"></b-form-input>
        </b-form-group>

        <b-row>
          <b-col sm="7">
            <b-form-group id="amount" label="Amount:" label-for="amount" :description="'You have ' + user.account.balance + ' and ' + user.account.sbd_balance + '.'">
              <b-form-input id="amount" type="number" v-model="amount" required placeholder="0.001"></b-form-input>
            </b-form-group>
          </b-col>
          <b-col sm="5">
            <b-form-group id="currency" label="Currency:" label-for="currency">
              <b-form-radio-group id="currency" buttons button-variant="outline-success" size="md" v-model="currency" :options="options" name="currency"/>
            </b-form-group>
          </b-col>
        </b-row>

        <b-form-group id="memo" label="Memo:" label-for="memo">
          <b-form-textarea v-model="memo" placeholder="memo" rows="3"></b-form-textarea>
        </b-form-group>
      </b-form>
    </b-container>
    <div class="text-center">
      <a class="btn btn-primary" :href="transferUrl" @click="$refs.transferModalRef.hide()" target="_blank">
        Proceed to SteemConnect!
      </a>
    </div>
  </b-modal>
</template>

<script>
  export default {
    props: ['user'],
    data: function(){
      return {
        receiver: '',
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
      transferUrl: function(){
        return 'https://v2.steemconnect.com/sign/transfer?to=' + this.receiver + '&amount=' + this.amount + '%20' + this.currency + '&memo=' + this.memo;
      },
    }
  };
</script>