<template>
  <div>
    <LangModal />
    <AboutModal />
    <SignupModal />
    <LoginModal :loginUrl="loginUrl" />
    <TransferModal />
  </div>
</template>

<script>
  import LangModal from '~/components/modals/LangModal'
  import AboutModal from '~/components/modals/AboutModal'
  import SignupModal from '~/components/modals/SignupModal'
  import LoginModal from '~/components/modals/LoginModal'
  import TransferModal from '~/components/modals/TransferModal'

  export default {
    props: ['loginUrl'],
    components: {
      LangModal,
      AboutModal,
      SignupModal,
      LoginModal,
      TransferModal,
    },
  };
</script>