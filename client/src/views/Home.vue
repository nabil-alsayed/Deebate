<template>
  <div class="page-layout">
    <div class="menu-bar">
      <MenuBar :activePage="activePage" @changePage="handlePageChange" />
    </div>
    <div class="main-content">
      <SearchBar :onSearch="handleSearch" />
      <div class="user-info">
        <div class="user-score">
          <img
            src="@/assets/avatars/user-avatar.svg"
            alt="User Avatar"
            class="avatar"
          />
          <div>
            <div class="username">@username</div>
            <div class="score">Score: 1234</div>
          </div>
        </div>
      </div>
      <DebateList :debates="filteredDebates" />
      <div v-if="activePage === 'Home'">
        <Categories />
        <Leaderboard />
      </div>
      <div v-else-if="activePage === 'Profile'">
        <EditProfile />
      </div>
    </div>
  </div>
</template>

<script>
import MenuBar from '@/components/MenuBar.vue'
import SearchBar from '@/components/SearchBar.vue'
import DebateList from '@/components/DebateList.vue'
import Categories from '@/components/Categories.vue'
import Leaderboard from '@/components/Leaderboard.vue'
import EditProfile from '@/components/EditProfile.vue'

export default {
  data() {
    return {
      debates: [],
      searchQuery: '',
      activePage: 'Home' // default to home
    }
  },
  computed: {
    filteredDebates() {
      return this.debates.filter((debate) =>
        debate.topic.toLowerCase().includes(this.searchQuery.toLowerCase())
      )
    }
  },
  methods: {
    handleSearch(query) {
      this.searchQuery = query
    },
    handlePageChange(page) {
      this.activePage = page
    }
  }
}
</script>

<style>
.page-layout {
  display: flex;
  background-color: #e7e7e7; /* Light Muted */
}

.menu-bar {
  width: 20%; /* 1/5th of the width */
  background-color: #007769; /* Primary color */
  color: white;
}

.main-content {
  flex: 1;
  padding: 20px;
}

.user-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.avatar {
  width: 50px;
  border-radius: 50%;
}

/* Add styles for categories and debates as needed */
</style>
