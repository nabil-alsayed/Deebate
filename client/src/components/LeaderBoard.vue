<template>
  <div class="leaderboard">
    <h3>Leaderboard</h3>
    <div
      class="leaderboard-item"
      v-for="(user, index) in topUsers"
      :key="user.id"
    >
      <span>{{ index + 1 }}.</span>
      <img :src="user.avatar" alt="User Avatar" class="avatar" />
      <div>
        <p class="username">@{{ user.username }}</p>
        <p class="level">{{ user.level }}</p>
      </div>
      <span class="score">{{ user.score }}</span>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      topUsers: [
        { id: 1, username: 'User1', level: 'Gold', score: 150 },
        { id: 2, username: 'User2', level: 'Silver', score: 120 },
        { id: 3, username: 'User3', level: 'Bronze', score: 100 },
        { id: 4, username: 'User4', level: 'Bronze', score: 80 },
        { id: 5, username: 'User5', level: 'Bronze', score: 60 }
      ]
    }
  }
}
</script>

<style scoped>
.leaderboard {
  margin-top: 20px;
}

.leaderboard-item {
  display: flex;
  align-items: center;
  margin-bottom: 10px;
}

.avatar {
  width: 30px;
  border-radius: 50%;
  margin-right: 10px;
}

.username {
  font-weight: bold;
}

.score {
  margin-left: auto;
}
</style>
