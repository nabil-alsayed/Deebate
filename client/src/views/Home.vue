<template>
  <div>
    <b-container fluid>
      <h1 class="display-5 fw-bold">DIT342 Frontend</h1>
      <p class="fs-4">Welcome to your DIT342 Frontend Vue.js App</p>
      <div
        style="
          display: flex;
          flex-direction: row;
          gap: 10px;
          justify-content: center;
        "
      >
        <b-button
          class="btn_message"
          style="background-color: red; border: none"
          variant="primary"
          href="/login"
          >Authentication</b-button
        >
        <b-button
          class="btn_message"
          variant="primary"
          v-on:click="getMessage()"
          >Get Message from Server</b-button
        >
      </div>
      <p class="col-xl-9">
        Message from the server:<br />
        {{ message }}
      </p>
    </b-container>
  </div>
</template>

<script>
import EditProfile from '@/components/EditProfile.vue'

export default {
  components: {
    EditProfile
  },
  data() {
    return {
      currentView: 'profile'
    }
  }
}
</script>

<style scoped>
.btn_message {
  margin-bottom: 1em;
}
</style>
