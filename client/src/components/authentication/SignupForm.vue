<template>
  <div class="form-container">
    <div
      style="
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        width: 100%;
      "
    >
      <b-card-title style="color: #007769" class=".rubik-text fw-semibold"
        >One Step Away! 🎉</b-card-title
      >
      <b-form style="width: 100%;" @submit.prevent="signup" class="form">
        <b-input type="email" v-model="user.email" placeholder="Email" />
        <b-input type="text" v-model="user.username" placeholder="@Username" />
        <b-input
          type="text"
          v-model="user.firstname"
          placeholder="First Name"
        />
        <b-input type="text" v-model="user.lastname" placeholder="Last Name" />
        <b-input
          type="password"
          v-model="user.password"
          placeholder="Password"
        />
        <b-button type="submit" class="button">Sign up</b-button>
      </b-form>
      <div class="flex flex-column column-gap-4 text-center">
        <p class="small fw-medium">
          Already have an account?
          <router-link to="/login" style="text-decoration: none"
            >Log in</router-link
          >
        </p>
        <div v-if="alertShown" :class="['alert-box', message.type]">
          {{ message.text }}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { Api } from '@/api/v1/Api.js'

export default {
  name: 'authentication',
  data() {
    return {
      user: {
        email: '',
        password: ''
      },
      message: {
        type: '',
        text: '',
      },
      alertShown: false
    }
  },
  methods: {
    async signup() {
      try {
        const response = await Api.post(
          '/auth/signup',
          {
            emailAddress: this.user.email,
            username: this.user.username,
            firstName: this.user.firstname,
            lastName: this.user.lastname,
            password: this.user.password
          }
        )

        // Handle the response, save the token if necessary
        this.message = {type: 'success', text: response.data.message || 'Sign up successful!'};

        // Redirect the user to the home page
        this.$router.push('/login')
      } catch (error) {
        // Handle errors and show an error message
        const errorMsg = error.response?.data?.message || 'Sign up failed, please try again.';
        this.message = {type: 'error', text: errorMsg};
        this.showAlert();
      }
    },
    showAlert() {
      // Show the alert
      this.alertShown = true;
      // Hide the alert after 2 seconds
      setTimeout(() => {
        this.alertShown = false;
      }, 2000);
    }
  }
}
</script>

<style>
.form-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
}

.form {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: fit-content;
  width: 500px;
  padding: 20px;
  gap: 20px;
}

.button {
  width: 100%;
  background-color: #007769;
  font-weight: bold;
  border: none;
}

.button:hover {
  background-color: #014a4a;
}

.button:active {
  background-color: #007769;
}

.button:focus {
  background-color: #007769;
}

.alert-box {
  position: fixed;
  top: 0;
  margin-top: 30px;
  left: 50%;
  transform: translateX(-50%);
  padding: 10px;
  border-radius: 5px;
  font-weight: bold;
  z-index: 1000;
  transition: opacity 0.3s ease, top 0.3s ease;
}

.alert-box.success {
  background-color: #d4edda;
  color: #398549;
}

.alert-box.error {
  background-color: #f8d7da;
  color: #a53d45;
}
</style>
