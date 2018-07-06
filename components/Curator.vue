<template>
  <b-col sm="12" md="4" class="mb-4 d-flex align-items-center justify-content-end flex-column">
    <div class="flex-column">
      <h2>#{{ index + 1 }}</h2>
      <div class="curator-profile-image" :style="{ backgroundImage: 'url(https://steemitimages.com/u/' + curator.curator + '/avatar/large)', width: imageSize + 'px', height: imageSize + 'px' }"></div>
      <h3><a :href="'https://steemit.com/@' + curator.curator" target="_blank">@{{ curator.curator }}</a></h3>
      <h5>{{ $t('halloffame.curated') }}: {{ curator.sbd.toFixed(0) }} SBD</h5>
    </div>
  </b-col>
</template>

<script>
  export default {
    props: ['curator', 'index'],
    computed: {
      imageSize() {
        // image size based on position:
        // 1st: 150px, 2nd: 100px, 3rd and following: 50px
        return this.index === 0 ? 150 : (this.index === 1 ? 100 : 50);
      }
    }
  }
</script>

<style lang="sass">
  .curator-profile-image
    background-size: cover
    background-position: center
    border-radius: 50%
    margin: 0 auto
</style>
