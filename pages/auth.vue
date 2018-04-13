<template>
  <div>{{ message }}</div>
</template>

<script>
  import Cookies from 'js-cookie'

  export default {
    data() {
      return {
        message: 'Logging in...'
      }
    },
    mounted() {
      let accessToken = this.$route.query.access_token || null;
      let expires = parseInt(this.$route.query.expires_in) || 604800;

      if (accessToken) {
        Cookies.set('frog_token', accessToken, {expires});
        window.location.href = '/';
      } else {
        this.message = 'No access token.'
      }
    }
  }
</script>