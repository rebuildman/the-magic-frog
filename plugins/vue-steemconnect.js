import Vue from 'vue';
import VueSteemConnect from 'vue-steemconnect';

Vue.use(VueSteemConnect, {
  app: 'themagicfrog.app',
  callbackURL: process.env.scRedirectUrl,
});
