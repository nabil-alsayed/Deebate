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
    display: grid;
    grid-template-columns: 1fr 3fr 1fr;
    grid-gap: 20px;
  }
  .menu-bar, .leaderboard {
    padding: 20px;
    background-color: #f0f0f0;
  }
  .main-content {
    padding: 20px;
  }
</style>
