import Vue from 'vue'
import VueI18n from 'vue-i18n'

Vue.use(VueI18n)

export default ({ app, store }, inject) => {
  let locale = process.env.host.split('.')[0];
  if (['de', 'fr'].indexOf(locale) === -1) {
    locale = 'en';
  }
  app.i18n = new VueI18n({
    locale: locale,
    fallbackLocale: 'en',
    messages: {
      'en': require('~/locales/en.json'),
      'de': require('~/locales/de.json'),
    }
  })

  app.i18n.path = (link) => {
    if (app.i18n.locale === app.i18n.fallbackLocale) {
      return `/${link}`
    }

    return `/${app.i18n.locale}/${link}`
  }

  let accounts = {
    en: 'the-magic-frog',
    de: 'der-zauberfrosch',
  }

  app.account = accounts[app.i18n.locale]
  Vue.prototype.$account = app.account
}
