<template>
  <div class="login-form-container">
    <div class="login-form">
      <b-card-title style="color: #007769" class=".rubik-text fw-semibold">Welcome back! 👋</b-card-title>
      <b-input type="email" v-model="email" placeholder="Email" />
      <b-input type="password" v-model="password" placeholder="Password" />
      <b-card-body class="small fw-semibold">Don't have an account? <router-link to="/signup" style="text-decoration: none">Sign up</router-link></b-card-body>
      <b-button type="submit" class="login-button" @click="login">Login</b-button>
    </div>
  </div>
</template>

<script>

export default {
  name: 'authentication',
  data() {
    return {
      user: {}
    }
  },
  methods: {
    login() {
      this.user = {
        email: this.email,
        password: this.password
      }
    },
    getUser(){
      this.user = {
        email: this.email
      }
    },
  }
}
</script>

<style>
  .login-form-container {
    display:flex;
    justify-content: center;
    align-items: center;
    height: 100%;
  }

  .login-form {
    display:flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    height: fit-content;
    width: 500px;
    padding: 20px;
    gap: 20px;
  }

  .login-button {
    width: 100%;
    background-color: #007769;
    font-weight: bold;
    border: none;
  }

  .login-button:hover {
    background-color: #014a4a;
  }

  .login-button:active {
    background-color: #007769;
  }

  .login-button:focus {
    background-color: #007769;
  }
</style>
