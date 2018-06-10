import sc2 from 'sc2-sdk'
import Cookies from 'js-cookie'

const SteemConnect = {
  computed: {
    sc2() {
      const api = sc2.Initialize({
        app: 'themagicfrog.app',
        callbackURL: this.redirectUrl,
        scope: ['vote', 'comment']
      });

      const accessToken = Cookies.get('frog_token');
      if (accessToken) {
        api.setAccessToken(accessToken);
        api.me((err, user) => {
          if (err) {
            console.log(err);
          } else {
            this.user = user;
          }
        });
      }
      return api;
    },
    redirectUrl() {
      if (process.env.NODE_ENV === 'development') {
        return process.env.scheme + '://' + process.env.host + (process.env.port ? ':' + process.env.port : '') + '/auth';
      } else if (this.$i18n.fallbackLocale === this.$i18n.locale) {
        return 'https://the-magic-frog.com/auth'
      }

      return 'https://' + this.$i18n.locale + '.the-magic-frog.com/auth'
    },
    loginUrl() {
      return this.sc2.getLoginURL();
    },
  },
  methods: {
    logout() {
      this.user = null;
      Cookies.remove('frog_token');
      return null;
    }
  }
};

export default SteemConnect;