<template>
  <b-modal id="whatIsThisModal" size="lg" hide-footer :title="$t('thismodal.title')">
    <p v-html="$t('thismodal.text1')"></p>
    <p v-html="$t('thismodal.text2')"></p>
    <p v-html="$t('thismodal.text3')"></p>
    <h4 class="mt-4">{{ $t('thismodal.havefun') }}</h4>
  </b-modal>
</template>