<template>
  <div class="container-fluid">
    <div class="row">
      <div class="col-md-3 menu-bar">
        <MenuBar />
      </div>
      <div class="col-md-6 main-content">
        <SearchBar @search-results="updateDebates" />
        <DebateList :searchResults="searchResults" />
      </div>
      <div class="col-md-3 leaderboard">
        <Leaderboard />
      </div>
    </div>
  </div>
</template>

<script>
import MenuBar from '@/components/MenuBar.vue'
import SearchBar from '@/components/SearchBar.vue'
import DebateList from '@/components/DebateList.vue'
import Leaderboard from '@/components/Leaderboard.vue'

export default {
  components: {
    MenuBar,
    SearchBar,
    DebateList,
    Leaderboard
  },
  data() {
    return {
      debates: [],
      searchQuery: '',
      searchResults: []
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
    },
    updateDebates(results) {
      this.searchResults = results
    }
  }
}
</script>

<style>
.container-fluid {
  background-color: #f0f0f0;
}

.menu-bar {
  padding: 10px;
}

.main-content {
  padding: 20px;
  overflow-y: auto;
}

.leaderboard {
  padding: 20px;
}

/* Custom styles */
.custom-header {
  font-size: 24px;
  color: #333;
}

.custom-paragraph {
  line-height: 1.6;
  color: #666;
}

#search-container {
  margin-bottom: 20px;
}

#debate-list {
  border: 1px solid #ddd;
  border-radius: 5px;
}

.highlight {
  background-color: yellow;
}

@media (max-width: 767px) {
  .menu-bar, .leaderboard {
    position: static;
    width: 100%;
    height: auto;
  }
  
  .main-content {
    margin-left: 0;
    margin-right: 0;
  }
}
</style>