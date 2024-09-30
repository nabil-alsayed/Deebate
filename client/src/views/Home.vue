<template>
  <div class="page-layout">
    <!-- Left Menu Bar (with Home and Profile buttons) -->
    <div class="menu-bar">
      <MenuBar />
      <button :class="{ active: currentView === 'home' }" @click="showHome">
        Home
      </button>
      <!-- Button to show leaderboard -->
      <button
        :class="{ active: currentView === 'profile' }"
        @click="showProfile"
      >
        Profile
      </button>
      <!-- Button to show edit profile -->
    </div>

    <!-- Main Content (Debates) -->
    <div class="main-content">
      <SearchBar :onSearch="handleSearch" />
      <DebateList :debates="filteredDebates" />
    </div>

    <!-- Right Sidebar (Conditional rendering for Profile or Leaderboard) -->
    <div class="right-sidebar">
      <!-- Show Leaderboard when 'Home' is clicked -->
      <Leaderboard v-if="currentView === 'home'" />

      <!-- Show EditProfile when 'Profile' is clicked -->
      <EditProfile v-else-if="currentView === 'profile'" />
    </div>
  </div>
</template>

<script>
import MenuBar from '@/components/MenuBar.vue'
import SearchBar from '@/components/SearchBar.vue'
import DebateList from '@/components/DebateList.vue'
import Leaderboard from '@/components/Leaderboard.vue'
import EditProfile from '@/components/EditProfile.vue'

export default {
  components: {
    MenuBar,
    SearchBar,
    DebateList,
    Leaderboard,
    EditProfile
  },
  data() {
    return {
      debates: [],
      searchQuery: '',
      currentView: 'home' // Initially showing 'home' view with Leaderboard
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
    showHome() {
      this.currentView = 'home' // Switch to showing Leaderboard
    },
    showProfile() {
      this.currentView = 'profile' // Switch to showing EditProfile
    }
  }
}
</script>

<style scoped>
.page-layout {
  display: grid;
  grid-template-columns: 1fr 3fr 1.5fr; /* Adjust the right column size */
  grid-gap: 20px;
}

.menu-bar,
.right-sidebar {
  padding: 20px;
  background-color: #f0f0f0;
}

.main-content {
  padding: 20px;
}

.right-sidebar {
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  gap: 20px;
}
.active {
  background-color: #007bff;
  color: white;
}
</style>
