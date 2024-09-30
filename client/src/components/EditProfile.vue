<template>
  <div class="edit-profile">
    <div class="profile-header">
      <h2 class="first-name">First Name</h2>
      <p class="username muted">@username</p>
    </div>
    <form @submit.prevent="saveProfile">
      <div class="field">
        <label>First Name</label>
        <input type="text" v-model="firstName" />
      </div>
      <div class="field">
        <label>Last Name</label>
        <input type="text" v-model="lastName" />
      </div>
      <div class="field">
        <label>Username</label>
        <input type="text" v-model="username" />
      </div>
      <div class="field">
        <label>Email</label>
        <input type="email" v-model="email" />
      </div>
      <div class="field">
        <label>Password</label>
        <input type="password" v-model="password" />
      </div>
      <button type="submit" class="save-button">Save</button>
    </form>
  </div>
</template>

<script>
import { Api } from '@/Api'

export default {
  data() {
    return {
      user: {
        firstName: 'John',
        lastName: 'Doe',
        username: 'john_doe',
        email: 'john@example.com',
        password: 'password123',
        avatarUrl: require('@/assets/avatars/user-avatar.svg')
      }
    }
  },
  methods: {
    getUserProfile() {
      // TODO
      this.user = {
        firstName: 'John',
        lastName: 'Doe',
        username: 'john_doe',
        email: 'john@example.com',
        password: '',
        avatarUrl: require('@/assets/avatars/user-avatar.png')
      }
    },
    saveProfile() {
      // TODO
      console.log('Saving mock profile:', this.user)
      alert('Profile updated successfully!')
    }
  }
}
</script>

<style scoped>
.edit-profile {
  background-color: #e7e7e7; /* Light Muted */
  padding: 20px;
  border-radius: 20px;
}

.field {
  margin-bottom: 15px;
}

label {
  display: block;
  margin-bottom: 5px;
}

input {
  width: 100%;
  padding: 10px;
  border-radius: 20px;
  border: none;
  background-color: white;
}

.save-button {
  background-color: #007769;
  color: white;
  padding: 10px;
  border-radius: 20px;
  border: none;
  cursor: pointer;
}
</style>
