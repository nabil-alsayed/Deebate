<template>
    <div class="search-bar">
      <input
        type="text"
        v-model="searchQuery"
        @input="emitSearch"
        placeholder="Search for a debate..."
      >
    </div>
  </template>

<script>
export default {
  name: 'SearchBar',
  data() {
    return {
      searchQuery: ''
    }
  },
  methods: {
    emitSearch() {
      this.$emit('search', this.searchQuery)
    }
  }
}
</script>

  <style scoped>
  .search-bar {
    width: 100%;
  }

  input {
    width: 100%;
    padding: 10px;
    font-size: 16px;
    border: 1px solid #ccc;
    border-radius: 4px;
  }
  </style>
