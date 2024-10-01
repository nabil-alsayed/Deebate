<template>
  <div class="login-form-container">
    <div style="display: flex; flex-direction: column; justify-content: center; align-items: center">
      <b-card-title style="color: #007769" class=".rubik-text fw-semibold">Welcome back! 👋</b-card-title>
      <b-form @submit.prevent="login" class="login-form">
        <b-input type="email" v-model="user.email" placeholder="Email" />
        <b-input type="password" v-model="user.password" placeholder="Password" />
        <b-button type="submit" class="login-button">Login</b-button>
      </b-form>
      <div class="flex flex-column column-gap-4 text-center">
        <p class="small fw-medium">Don't have an account? <router-link to="/signup" style="text-decoration: none">Sign up</router-link></p>
        <p class="small fw-medium">{{ message }}</p>
      </div>
    </div>
  </div>
</template>

<script>

import axios from "axios";

let message = 'none';

export default {
  name: 'authentication',
  data() {
    return {
      user: {
        email: '',
        password: ''
      },
      message: ''
    };
  },
  methods: {
    async login() {
      try {
        const response = await axios.post('http://localhost:3001/api/v1/auth/login', {
          emailAddress: this.user.email,
          password: this.user.password
        });

        // Handle the response, save the token if necessary
        console.log('Login successful:', response.data);
        this.message = response.data.message || 'Login successful!';

        // Save the token in local storage
        localStorage.setItem('token', response.data.token);

        // Redirect the user to the profile page
        this.$router.push('/profile');
      } catch (error) {
        // Handle errors and show an error message
        this.message = error.response && error.response.data.message
          ? error.response.data.message
          : 'Login failed, please try again.';
        console.error('Login failed:', this.message);
      }
    }
  }
};
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
