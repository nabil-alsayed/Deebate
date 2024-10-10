<template>
  <div class="search-bar">
    <input
      type="text"
      v-model="searchQuery"
      @input="emitSearch"
      placeholder="Search for a user"
      aria-label="Search for a user"
    />
  </div>
</template>

<script>
import { ref } from 'vue'

export default {
  name: 'SearchBar',
  emits: ['search'],
  setup(props, { emit }) {
    const searchQuery = ref('')

    function emitSearch() {
      emit('search', searchQuery.value)
    }

    return {
      searchQuery,
      emitSearch
    }
  }
}
</script>

<style scoped>
.search-bar {
  margin-bottom: 20px;
}

input {
  width: 100%;
  padding: 10px;
  font-size: 16px;
  border: 1px solid #ccc;
  border-radius: 4px;
}
</style>
