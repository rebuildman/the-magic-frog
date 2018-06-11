<template>
  <b-container>
    <div class="text-center py-5">
      <img src="/avatar.png" alt=""/>
      <h1 class="pt-4">{{ message }}</h1>
      <div class="upload-spinner" v-if="loading">
        <div class="dot1"></div>
        <div class="dot2"></div>
      </div>
    </div>
  </b-container>
</template>

<script>
  import Cookies from 'js-cookie'

  export default {
    head() {
      return { 
        title: this.$t('index.themagicfrog'),
        meta: [
          { hid: 'description', name: 'description', content: this.$t('index.description') }
        ] 
      }
    },
    data() {
      return {
        message: this.$t('auth.openthedoor'),
        loading: true
      }
    },
    mounted() {
      let accessToken = this.$route.query.access_token || null;
      let expires = parseInt(this.$route.query.expires_in) || 604800;

      if (accessToken) {
        Cookies.set('frog_token', accessToken, {expires});
        window.location.href = '/';
      } else {
        this.loading = false;
        this.message = this.$t('auth.nokey')
      }
    }
  }
</script>
