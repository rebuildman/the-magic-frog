<template>
  <b-col sm="12" md="6" lg="4">
    <div class="archivedStory">
      <h3>
        <a href="#" v-b-modal="'archivedStoryModal' + meta.storyNumber">
          {{ $t('archive.themagicstory') }} #{{ meta.storyNumber }}
        </a>
      </h3>
      <a href="#" v-b-modal="'archivedStoryModal' + meta.storyNumber" class="cover" :style="'background-image: url(' + image + ')'"></a>
      <audio controls v-if="hasAudio">
        <source :src="'/audio/the-magic-story-' + meta.storyNumber + '-' + $i18n.locale + '.mp3'" type="audio/mpeg">
        Your browser does not support the audio element. :(
        You can download the mp3 file here: <a href="">https://the-magic-frog.com/audio/the-magic-story-{{ meta.storyNumber }}.mp3</a>
      </audio>
      <div class="no-audio" v-else>
        <div v-if="audioIsLoading">
          <svg class="spinner" style="width:12px;height:12px" viewBox="0 0 24 24">
            <path fill="#aaaaaa" d="M12,4V2A10,10 0 0,0 2,12H4A8,8 0 0,1 12,4Z" />
          </svg>
          looking for audio...
        </div>
        <div v-else>{{ $t('archive.audiowillbe') }}</div>
      </div>
    </div>

    <b-modal class="storyModal" :id="'archivedStoryModal' + meta.storyNumber" :title="$t('archive.themagicstory') + ' #' + meta.storyNumber" size="lg" hide-footer>
      <h1 class="mb-4">{{ meta.startPhrase }}</h1>
      <div class="text-center">
        <button type="button" class="btn btn-sm btn-outline-secondary mb-3" @click.prevent="$store.commit('setShowUsernames', false)" v-if="showUsernames">
          {{ $t('index.hideusernames') }}
        </button>
        <button type="button" class="btn btn-sm btn-outline-secondary mb-3" @click.prevent="$store.commit('setShowUsernames', true)" v-else>
          {{ $t('index.showusernames') }}
        </button>
      </div>
      <StoryPart v-for="(part, index) in meta.commands" :key="index" :part="part" />
      <h2 class="text-center" v-if="!hasEnded">{{ meta.toBeContinued }}</h2>
    </b-modal>
  </b-col>
</template>

<script>
  import StoryPart from '~/components/StoryPart'
  import axios from 'axios'
  import { mapGetters } from 'vuex'

  export default {
    components: {
      StoryPart
    },
    props: ['story'],
    data() {
      return {
        hasAudio: false,
        audioIsLoading: true
      }
    },
    computed: {
      ...mapGetters(['showUsernames']),
      meta() {
        return JSON.parse(this.story.json_metadata);
      },
      image() {
        // look for first image in the story (will act as the cover)
        let image = null;
        this.meta.commands.forEach(command => {
          if (!image && command.hasOwnProperty('image') && command.image) {
            image = command.image;
          }
        });

        return image || '/default-cover.png';
      },
      hasEnded() {
        return this.meta.hasOwnProperty('commands') && this.meta.commands.length && this.meta.commands[this.meta.commands.length - 1].type === 'end';
      }
    },
    mounted() {
      // check if audio file for story exists
      axios.get('/audio/the-magic-story-' + this.meta.storyNumber + '-' + this.$i18n.locale + '.mp3').then(res => {
        this.hasAudio = res.status === 200;
        this.audioIsLoading = false;
      }).catch((err) => {
        console.log(err);
        this.audioIsLoading = false;
      });
    }
  }
</script>

<style lang="sass">
  .archivedStory
    border: solid 1px #ccc
    border-radius: 4px
    overflow: hidden
    margin-bottom: 15px
    h3
      margin: 15px 0
      a
        color: #000
        &:hover
          text-decoration: none
    .cover
      display: block
      height: 250px
      background-position: center center
      background-size: cover
      border-top: solid 1px #ccc
      border-bottom: solid 1px #ccc
    audio
      width: 100%
      float: left
    .no-audio
      text-align: center
      padding: 6px 5px
      vertical-align: middle
      color: #aaa
      font-size: 13px
  .storyModal
    p
      margin-bottom: 5px

  @media (max-width: 1200px)
    .archivedStory
      .cover
        height: 210px

  @media (max-width: 768px)
    .archivedStory
      .cover
        height: 250px
</style>
