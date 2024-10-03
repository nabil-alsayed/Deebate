<template>
    <div class="page-layout">
      <div class="menu-bar">
        <MenuBar />
      </div>
      <div class="main-content">
        <SearchBar :onSearch="handleSearch" />
        <DebateList :debates="filteredDebates" />
      </div>
      <div class="leaderboard">
        <Leaderboard />
      </div>
    </div>
  </template>
<script>

import MenuBar from '@/components/MenuBar.vue'
import SearchBar from '@/components/SearchBar.vue'
import DebateList from '@/components/DebateList.vue'
import Leaderboard from '@/components/Leaderboard.vue'

export default {
  data() {
    return {
      debates: [],
      searchQuery: ''
    }
  },
  computed: {
    filteredDebates() {
      return this.debates.filter(debate =>
        debate.topic.toLowerCase().includes(this.searchQuery.toLowerCase())
      )
    }
  },
  methods: {
    handleSearch(query) {
      this.searchQuery = query
    }
  }
}
</script>

  <style>
.page-layout {
  grid-template-columns: 1fr 3fr 1fr;
  grid-gap: px;
  background-color: #f0f0f0;
}

.menu-bar {
  position: fixed;
  top: 0;
  left: 0;
  width: 18vw;
  height: 100vw;
  padding: 10px;
}

.main-content {
  margin-left: 350px; 
  margin-right: 350px; 
  padding: 20px;
  overflow-y: auto;
}

.leaderboard {
  position: fixed;
  top: 0;
  right: 0;
  width: 18vw;
  height: 100vw;
  padding: 20px;
}
</style>
