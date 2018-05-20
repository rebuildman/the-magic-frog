import Vue from 'vue'
import VueI18n from 'vue-i18n'

Vue.use(VueI18n)

export default ({ app, store }, inject) => {
  // Set i18n instance on app
  // This way we can use it in middleware and pages asyncData/fetch
  app.i18n = new VueI18n({
    locale: process.env.lang,
    fallbackLocale: 'en',
    messages: {
      'en': require('~/locales/en.json'),
      'de': require('~/locales/de.json'),
      'fr': require('~/locales/fr.json')
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
    fr: 'grenouille-magique'
  }

  app.account = accounts[app.i18n.locale]
}
