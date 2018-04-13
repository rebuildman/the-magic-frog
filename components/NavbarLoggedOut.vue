<template>
  <b-navbar toggleable="md">

    <b-navbar-toggle target="nav_collapse"></b-navbar-toggle>

    <b-collapse is-nav id="nav_collapse">
      <b-navbar-nav class="mx-auto">
        <!--<b-nav-item href="#">Story Archive</b-nav-item>-->
        <!--<b-nav-item href="#">FAQ</b-nav-item>-->
        <b-nav-item v-b-modal.steemSignupModal>Sign Up</b-nav-item>
        <b-nav-item v-b-modal.scRedirectModal>Login</b-nav-item>
      </b-navbar-nav>
    </b-collapse>
  </b-navbar>
</template>