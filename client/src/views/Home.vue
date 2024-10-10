<template>
  <div :class="['page-layout', isMobile ? 'mobile-layout' : 'desktop-layout']">
    <div class="menu-bar">
      <MenuBar @profile-clicked="showProfile" @home-clicked="showHome" />
    </div>
    <div class="main-content">
      <SearchBar @search-results="updateDebates" />
      <DebateList :searchResults="searchResults" />
    </div>
    <div v-if="showEditProfile" class="right-bar">
      <EditProfile />
    </div>
  </div>
</template>

<script>
import MenuBar from '@/components/MenuBar.vue'
import SearchBar from '@/components/SearchBar.vue'
import DebateList from '@/components/DebateList.vue'
import EditProfile from '@/components/EditProfile.vue'

export default {
  components: {
    MenuBar,
    SearchBar,
    DebateList,
    EditProfile
  },
  data() {
    return {
      isMobile: false,
      showEditProfile: false,
      searchResults: [] // Track debates
    }
  },
  mounted() {
    this.isMobile = window.innerWidth <= 576
    window.addEventListener('resize', this.handleResize)
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.handleResize)
  },
  methods: {
    handleResize() {
      this.isMobile = window.innerWidth <= 576
    },
    showProfile() {
      this.showEditProfile = true
    },
    showHome() {
      this.showEditProfile = false
    },
    updateDebates(results) {
      this.searchResults = results
    }
  }
}
</script>

<style>
.page-layout {
  display: grid;
  grid-template-columns: 300px auto 300px; /* Left sidebar, main content, right sidebar */
  grid-gap: 20px; /* Equal space between columns */
  background-color: #f0f0f0; /* Restore background for page layout */
}

.desktop-layout {
  grid-template-columns: 300px auto 300px;
}

.mobile-layout {
  grid-template-columns: 1fr;
  padding-top: 70px; /* Account for the mobile navbar height */
}

.main-content {
  padding: 20px;
  overflow-y: auto;
  background-color: #ffffff; /* Restore white background for the main content */
  border-radius: 10px; /* Add rounded corners */
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1); /* Subtle shadow */
}

.right-bar {
  background-color: #ffffff;
  padding: 20px;
  border-radius: 10px;
  height: 100vh;
  position: fixed;
  top: 0;
  right: 0;
}

/* Hide entire right bar (including EditProfile) before the left bar at 768px */
@media (max-width: 768px) {
  .right-bar {
    display: none;
  }
}

@media (max-width: 576px) {
  .page-layout {
    grid-template-columns: 1fr;
  }
  .menu-bar {
    display: none; /* Hide left bar for mobile */
  }
}
</style>
