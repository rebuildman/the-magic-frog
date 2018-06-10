<template>
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
</template>

<script>
  export default {
    computed:{
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
