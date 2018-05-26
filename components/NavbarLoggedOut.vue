<template>
  <b-navbar toggleable="md">

    <b-navbar-toggle target="nav_collapse"></b-navbar-toggle>

    <b-collapse is-nav id="nav_collapse">
      <b-navbar-nav class="mx-auto">
        <b-nav-item v-b-modal.langModal>
          <svg style="width:24px;height:24px" viewBox="0 0 24 24">
            <path d="M17.9,17.39C17.64,16.59 16.89,16 16,16H15V13A1,1 0 0,0 14,12H8V10H10A1,1 0 0,0 11,9V7H13A2,2 0 0,0 15,5V4.59C17.93,5.77 20,8.64 20,12C20,14.08 19.2,15.97 17.9,17.39M11,19.93C7.05,19.44 4,16.08 4,12C4,11.38 4.08,10.78 4.21,10.21L9,15V16A2,2 0 0,0 11,18M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2Z" />
          </svg>
        </b-nav-item>
        <li class="nav-item">
          <nuxt-link to="/" class="nav-link">
            <svg style="width:24px;height:24px" viewBox="0 0 24 24">
              <path d="M9,19V13H11L13,13H15V19H18V10.91L12,4.91L6,10.91V19H9M12,2.09L21.91,12H20V21H13V15H11V21H4V12H2.09L12,2.09Z" />
            </svg>
          </nuxt-link>
        </li>
        <b-nav-item v-b-modal.whatIsThisModal>{{ $t('nav.whatisthis') }}</b-nav-item>
        <li class="nav-item"><nuxt-link to="/archive" class="nav-link">{{ $t('nav.archive') }}</nuxt-link></li>
        <li class="nav-item"><nuxt-link to="/hall-of-fame" class="nav-link">{{ $t('nav.halloffame') }}</nuxt-link></li>
        <b-nav-item v-b-modal.steemSignupModal>{{ $t('nav.signup') }}</b-nav-item>
        <b-nav-item v-b-modal.scRedirectModal>{{ $t('nav.login') }}</b-nav-item>
      </b-navbar-nav>
    </b-collapse>
  </b-navbar>
</template>