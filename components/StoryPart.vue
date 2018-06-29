<template>
  <div class="text-center mb-3">
    <div v-if="part.appendText" v-html="appendHtml"></div>
    <div v-if="part.image" class="mb-1">
      <img :src="part.image" alt="" class="img-fluid" />
    </div>
    <h3 v-if="part.type === 'end'">{{ $t('index.form.theend') }}</h3>
    <sup>{{ $t('footer.by') }} <a :href="'https://steemit.com/@' + part.author" target="_blank">@{{ part.author }}</a></sup>
  </div>
</template>

<script>
  import marked from 'marked'

  export default {
    props: ['part'],
    computed: {
      appendHtml() {
        return marked(this.part.appendText);
      }
    }
  }
</script>
