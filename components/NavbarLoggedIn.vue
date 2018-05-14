<template>
  <b-navbar toggleable="md">

    <b-navbar-toggle target="nav_collapse"></b-navbar-toggle>

    <b-collapse is-nav id="nav_collapse">
      <b-navbar-nav class="mx-auto">
        <li class="nav-item">
          <nuxt-link to="/" class="nav-link">
            <svg style="width:24px;height:24px" viewBox="0 0 24 24">
              <path d="M9,19V13H11L13,13H15V19H18V10.91L12,4.91L6,10.91V19H9M12,2.09L21.91,12H20V21H13V15H11V21H4V12H2.09L12,2.09Z" />
            </svg>
          </nuxt-link>
        </li>
        <li class="nav-item"><nuxt-link to="/archive" class="nav-link">Story Archive</nuxt-link></li>
        <b-nav-item v-b-modal.whatIsThisModal>What is this?</b-nav-item>
        <b-nav-item v-b-modal.userModal>{{ user.name }}</b-nav-item>
        <b-nav-item @click="logout">logout</b-nav-item>
      </b-navbar-nav>
    </b-collapse>
  </b-navbar>
</template>

<script>
  export default {
    props: ['user'],
    methods: {
      logout() {
        this.$parent.logout();
      }
    }
  };
</script>