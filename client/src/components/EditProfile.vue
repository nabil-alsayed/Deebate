<template>
  <div class="edit-profile">
    <div class="profile-header">
      <!-- Avatar -->
      <img :src="user.avatarUrl" alt="User Avatar" class="avatar" />

      <!-- User Info -->
      <div class="user-info">
        <h3>{{ user.firstName }}</h3>
        <p>@{{ user.username }}</p>
      </div>
    </div>

    <!-- Edit Profile Form -->
    <form @submit.prevent="saveProfile">
      <div class="form-group">
        <label for="firstName">First Name</label>
        <input type="text" v-model="user.firstName" id="firstName" />
      </div>

      <div class="form-group">
        <label for="lastName">Last Name</label>
        <input type="text" v-model="user.lastName" id="lastName" />
      </div>

      <div class="form-group">
        <label for="username">Username</label>
        <input type="text" v-model="user.username" id="username" />
      </div>

      <div class="form-group">
        <label for="email">Email</label>
        <input type="email" v-model="user.email" id="email" />
      </div>

      <div class="form-group">
        <label for="password">Password</label>
        <input type="password" v-model="user.password" id="password" />
      </div>

      <button type="submit" class="save-btn">Save</button>
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
        avatarUrl: 'https://example.com/avatar.jpg' // Mock avatar URL
      }
    }
  },
  methods: {
    getUserProfile() {
      // Mock data for now
      this.user = {
        firstName: 'John',
        lastName: 'Doe',
        username: 'john_doe',
        email: 'john@example.com',
        password: '',
        avatarUrl: 'https://example.com/avatar.jpg'
      }
    },
    saveProfile() {
      // Eventually replace with real API request
      console.log('Saving mock profile:', this.user)
      alert('Profile updated successfully!')
    }
  }
}
</script>

<style scoped>
.edit-profile {
  width: 300px;
  padding: 20px;
  background-color: #f9f9f9;
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.profile-header {
  display: flex;
  align-items: center;
  margin-bottom: 20px;
}

.avatar {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  margin-right: 15px;
}

.user-info h3 {
  margin: 0;
  font-size: 18px;
}

.user-info p {
  margin: 0;
  font-size: 14px;
  color: #666;
}

.form-group {
  margin-bottom: 15px;
}

.form-group label {
  display: block;
  margin-bottom: 5px;
  font-size: 14px;
  color: #333;
}

.form-group input {
  width: 100%;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 5px;
}

.save-btn {
  width: 100%;
  padding: 10px;
  background-color: #007bff;
  color: #fff;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.save-btn:hover {
  background-color: #0056b3;
}
</style>
