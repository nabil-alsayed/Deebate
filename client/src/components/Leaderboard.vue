<template>
    <div class="leaderboard">
      <h2>Leaderboard</h2>
      <div v-for="user in users" :key="user._id" class="leaderboard-item">
      <img :src="user.profileImg" alt="User Avatar" class="user-avatar" />
      <div class="username">{{ user.username }}</div>
    </div>
    </div>
  </template>

<script>
import { Api } from '@/Api'

export default {
  name: 'Leaderboard',
  data() {
    return {
      users: []
    }
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
