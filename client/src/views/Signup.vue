<template>
  <div class="auth-container">
    <div class="login-section">
      <signup-form />
    </div>
    <div class="poster-section">
      <div class="poster">
        <!-- Display different logos based on screen size -->
        <b-card-img src="/logo/deebate-logo-light.png" alt="Light Logo" class="logo light-logo" />
        <b-card-img src="/logo/deebate-logo-dark.png" alt="Dark Logo" class="logo dark-logo" />
        <b-card-text class="slogan m-0">
          <h4 class="fw-bold m-0">Deebate</h4>
          <p class="m-0 removable .rubik-text fw-lighter">Stand for your belief!</p>
        </b-card-text>
      </div>
    </div>
  </div>
</template>

<script>
import SignupForm from "@/components/authentication/signup-form.vue";

export default {
  name: "signup",
  components: { SignupForm }
};
</script>

<style scoped>
 .container{
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
 }
 .right {
   order: 1;
 }
</style>
