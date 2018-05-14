<template>
  <b-col sm="12" md="6">
    <div class="archivedStory">
      <h3>
        <a href="#" v-b-modal="'archivedStoryModal' + meta.storyNumber">
          The Magic Story #{{ meta.storyNumber }}
        </a>
      </h3>
      <a href="#" v-b-modal="'archivedStoryModal' + meta.storyNumber" class="cover" :style="'background-image: url(' + image + ')'"></a>
    </div>

    <b-modal :id="'archivedStoryModal' + meta.storyNumber" :title="'The Magic Story #' + meta.storyNumber" size="lg" hide-footer>
      <h1 class="mb-5">{{ meta.startPhrase }}</h1>
      <StoryPart v-for="(part, index) in meta.commands" :key="index" :part="part" />
    </b-modal>
  </b-col>
</template>

<script>
  import StoryPart from '~/components/StoryPart'

  export default {
    components: {
      StoryPart
    },
    props: ['story'],
    computed: {
      meta() {
        return JSON.parse(this.story.json_metadata);
      },
      image() {
        let image = null;
        this.meta.commands.forEach(command => {
          console.log(command.image);
          if (command.hasOwnProperty('image') && command.image) {
            image = command.image;
          }
        });

        return image || 'https://steemitimages.com/DQmeK9D1q35gERzGWfQBD9MKGzuU5wjDNSM1q561dbGxdmL/avatar.png';
      }
    }
  }
</script>

<style lang="sass">
  .archivedStory
    border: solid 1px #ccc
    border-radius: 4px
    padding: 15px
    h3
      margin-bottom: 15px
      a
        &:hover
          text-decoration: none
      img
        margin-top: 15px
    .cover
      display: block
      height: 500px
      background-position: center center
      background-size: cover

  @media (max-width: 991px)
    .archivedStory
      .cover
        height: 350px

  @media (max-width: 786px)
    .archivedStory
      .cover
        height: 250px
</style>