<template>
  <div class="edit-profile">
    <div class="profile-header">
      <h2 class="user-name">{{ user.firstName }}</h2>
      <p class="username">@{{ user.username }}</p>
    </div>
    <form @submit.prevent="saveProfile">
      <div class="field">
        <label>First Name</label>
        <input type="text" v-model="editedUser.firstName" />
      </div>
      <div class="field">
        <label>Last Name</label>
        <input type="text" v-model="editedUser.lastName" />
      </div>
      <div class="field">
        <label>Username</label>
        <input type="text" v-model="editedUser.username" />
      </div>
      <div class="field">
        <label>Email</label>
        <input type="email" v-model="editedUser.emailAddress" />
      </div>
      <div class="field password-field">
        <label>Password</label>
        <input type="password" v-model="editedUser.password" />
      </div>
      <button type="submit" class="save-button">Save</button>
    </form>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  data() {
    const user = JSON.parse(localStorage.getItem('user'))
    const { emailAddress, username, password, firstName, lastName, role } = user
    console.log(user, 39)
    return {
      user: { emailAddress, username, password, firstName, lastName, role },
      editedUser: {
        emailAddress,
        username,
        password,
        firstName,
        lastName,
        role
      }
    }
  },
  methods: {
    async saveProfile() {
      this.user = { ...this.editedUser }
      const user = this.user
      const config = {
        headers: {
          Authorization: 'Bearer ' + localStorage.getItem('token')
        }
      }
      console.log('Saving profile:', this.user)
      const localUser = JSON.parse(localStorage.getItem('user'))
      // alert('Profile updated successfully!')
      // eslint-disable-next-line no-undef
      const response = await axios.patch(
        'http://localhost:3000/api/v1/users/' + localUser._id,
        user,
        config
      )
      // Handle the response, save the token if necessary
      console.log('successful:', response.data)
    }
  },
  created() {
    this.editedUser = { ...this.user }
  }
}
</script>

<style scoped>
.edit-profile {
  background-color: #ffffff;
  padding: 20px;
  border-radius: 10px;
  margin-top: 20px;
}

.profile-header {
  margin-bottom: 20px;
}

.user-name {
  font-weight: bold;
  margin: 0;
}

.username {
  font-weight: bold;
  color: #a5a4a4;
  margin: 0;
}

.field {
  margin-bottom: 15px;
}

.password-field {
  margin-bottom: 25px;
}

label {
  display: block;
  margin-bottom: 5px;
  color: #a5a4a4;
  font-weight: bold;
  text-align: left;
}

input {
  width: 100%;
  padding: 10px;
  border-radius: 10px;
  border: none;
  background-color: #e7e7e7;
  font-weight: bold;
}

.save-button {
  width: 100%;
  background-color: #007769;
  color: white;
  padding: 10px;
  border-radius: 10px;
  border: none;
  cursor: pointer;
  font-weight: bold;
}
</style>
