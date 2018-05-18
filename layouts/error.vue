<template>
  <b-container>
    <div class="text-center py-5">
      <img src="/avatar.png" alt="" class="mb-4"/>
      <h1 v-if="error.statusCode === 404">What you are looking for does not exist!</h1>
      <h1 v-else>Oh no! Something went horribly wrong!</h1>
      <nuxt-link to="/" class="mt-5 d-inline-block">
        <svg style="width:30px;height:30px" viewBox="0 0 24 24">
          <path d="M9,19V13H11L13,13H15V19H18V10.91L12,4.91L6,10.91V19H9M12,2.09L21.91,12H20V21H13V15H11V21H4V12H2.09L12,2.09Z" />
        </svg><br>
        Go home!
      </nuxt-link>
    </div>
  </b-container>
</template>

<script>
  export default {
    props: ['error']
  }
</script>