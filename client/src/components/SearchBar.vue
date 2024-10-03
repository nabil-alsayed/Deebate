<template>
  <div class="search-bar">
    <div class="search-input-group">
      <input
        type="text"
        v-model="searchQuery"
        @focus="showCategories = true"
        @input="filterCategories"
        @keyup.enter="searchDebates"
        placeholder="Search for a debate..."
      />
      <button @click="searchDebates">Search</button>
    </div>

    <transition name="slide-fade">
      <div v-if="showCategories && filteredCategories.length" class="category-dropdown">
        <div
          v-for="category in filteredCategories"
          :key="category"
          class="category-item"
          @click="selectCategory(category)"
        >
          {{ category }}
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
import { ref, computed } from 'vue'
import { Api } from '@/Api'

export default {
  name: 'SearchBar',
  emits: ['search-results'],
  setup(props, { emit }) {
    const searchQuery = ref('')
    const showCategories = ref(false)
    const categories = ['Sports', 'Science', 'Politics', 'Technology', 'Health', 'Education']

    const filteredCategories = computed(() => 
      categories.filter(category =>
        category.toLowerCase().includes(searchQuery.value.toLowerCase())
      )
    )

    function selectCategory(category) {
      searchQuery.value = category
      showCategories.value = false
    }

    async function searchDebates() {
      try {
        const response = await Api.get(`/v1/debates?category=${searchQuery.value}`)
        emit('search-results', response.data.debates)
      } catch (error) {
        console.error('Error fetching debates:', error)
        emit('search-results', [])
      }
    }

    return {
      searchQuery,
      showCategories,
      filteredCategories,
      selectCategory,
      searchDebates
    }
  }
}
</script>

<style scoped>
.search-bar {
  position: relative;
  width: 100%;
}

input {
  width: 100%;
  padding: 10px;
  font-size: 16px;
  border: 1px solid #ccc;
  border-radius: 4px;
}

button {
  padding: 10px 15px;
  margin-left: 5px;
  border: none;
  background-color: #007B7B;
  color: white;
  border-radius: 4px;
  cursor: pointer;
}

button:hover {
  background-color: #005f5f;
}

.category-dropdown {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background: white;
  border: 1px solid #ccc;
  border-radius: 4px;
  z-index: 10;
}

.category-item {
  padding: 10px;
  cursor: pointer;
}

.category-item:hover {
  background: #f0f0f0;
}

.slide-fade-enter-active, .slide-fade-leave-active {
  transition: opacity 0.5s ease, transform 0.5s ease;
}
.slide-fade-enter, .slide-fade-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

.debate-list {
  margin-top: 20px;
}

.debate-list h3 {
  margin: 0 0 10px 0;
}

.debate-list ul {
  list-style-type: none;
  padding: 0;
}

.debate-list li {
  padding: 5px 0;
  border-bottom: 1px solid #eee;
}
</style>
