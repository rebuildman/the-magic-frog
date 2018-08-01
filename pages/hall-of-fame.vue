<template>
  <section>
    <NavbarLoggedIn v-if="user" :user="user" />
    <NavbarLoggedOut v-else />
    <b-container>
      <h1 class="my-5">{{ $t('halloffame.title') }}</h1>
      <h2 v-if="delegators.length">{{ $t('halloffame.sponsors') }}</h2>
      <b-row v-if="delegators.length">
        <Delegator v-for="(delegator, index) in delegators" :key="index" :index="index" :delegator="delegator" />
      </b-row>
      <h2 class="mt-5 pt-5" v-if="curators.length">{{ $t('halloffame.curators') }}</h2>
      <b-row v-if="curators.length">
        <Curator v-for="(curator, index) in curators" :key="index" :index="index" :curator="curator" :rsharesToSBDFactor="rsharesToSBDFactor" />
      </b-row>
      <h2 class="mt-5 pt-5" v-if="contributors.length">{{ $t('halloffame.storytellers') }}</h2>
      <b-row>
        <Contributor v-for="(contributor, index) in contributors" :key="index" :index="index" :contributor="contributor" />
      </b-row>
    </b-container>
    <Footer />
    <Modals :user="user" />
  </section>
</template>

<script>
  import axios from 'axios'
  import steem from 'steem'

  import NavbarLoggedIn from '~/components/NavbarLoggedIn'
  import NavbarLoggedOut from '~/components/NavbarLoggedOut'
  import Footer from '~/components/Footer'
  import Modals from '~/components/Modals'
  import Contributor from '~/components/Contributor'
  import Delegator from '~/components/Delegator'
  import Curator from '~/components/Curator'
 
  import { mapGetters } from 'vuex'

  export default {
    components: {
      NavbarLoggedIn,
      NavbarLoggedOut,
      Footer,
      Modals,
      Contributor,
      Delegator,
      Curator
    },
    head() {
      // localizing meta description
      return { 
        title: this.$t('index.themagicfrog'),
        meta: [
          { hid: 'description', name: 'description', content: this.$t('index.description') }
        ] 
      }
    },
    computed: {
      ...mapGetters(['user', 'contributors', 'delegators', 'curators', 'rsharesToSBDFactor'])
    },
    async mounted () {
      // login
      this.$store.dispatch('login')

      // fetch data
      this.$store.dispatch('fetchContributors')
      this.$store.dispatch('fetchDelegators')
      this.$store.dispatch('fetchCurators')
      this.$store.dispatch('fetchRsharesToSBDFactor')
    },
  }
</script>
