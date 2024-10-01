<template>
    <div class="leaderboard">
      <h2>Leaderboard</h2>
      <ul>
        <li v-for="(user, index) in users" :key="user._id" class="leaderboard-item">
          <span class="rank">{{ index + 1 }}{{ getOrdinal(index + 1) }}</span>
          <img :src="user.profileImg || placeholderImage" :alt="user.username" class="user-avatar">
          <span class="username">{{ user.username }}</span>
          <!-- Placeholder for future points field -->
          <span class="points">Points: Coming soon</span>
        </li>
      </ul>
    </div>
  </template>

<script>
import { Api } from '@/Api'

export default {
  name: 'Leaderboard',
  data() {
    return {
      users: [],
      placeholderImage: 'path-to-placeholder-image.jpg' // Use a placeholder if no profileImg is available
    }
  },
  methods: {
    // Fetch all users for the leaderboard
    fetchUsers() {
      Api.get('/v1/users')
        .then(response => {
          this.users = response.data // Assuming the API returns an array of users
        })
        .catch(error => {
          console.error('Error fetching users:', error)
        })
    },
    // Helper function to get ordinal suffix for ranking
    getOrdinal(n) {
      const s = ['th', 'st', 'nd', 'rd']
      const v = n % 100
      return (s[(v - 20) % 10] || s[v] || s[0])
    }
  },
  mounted() {
    // Fetch users data when component mounts
    this.fetchUsers()
  }
}
</script>

  <style scoped>
  .leaderboard {
    background-color: white;
    border: 1px solid #e0e0e0;
    border-radius: 8px;
    padding: 15px;
  }

  .leaderboard-item {
    display: flex;
    align-items: center;
    padding: 10px 0;
    border-bottom: 1px solid #eee;
  }

  .rank {
    width: 30px;
    font-weight: bold;
  }

  .user-avatar {
    width: 30px;
    height: 30px;
    border-radius: 50%;
    margin-right: 10px;
  }

  .username {
    flex-grow: 1;
  }

  .points {
    font-weight: bold;
    color: #007B7B;
  }
  </style>
