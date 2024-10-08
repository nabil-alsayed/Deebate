<template>
  <div class="container-fluid">
    <div class="row">
      <div class="col-md-3 menu-bar">
        <MenuBar />
      </div>
      <div class="col-md-6 main-content">
        <SearchBar @search-results="updateDebates" />
        <DebateList :debates="filteredDebates" />
      </div>
      <div class="col-md-3 category-selector">
        <CategorySelector @category-selected="filterDebatesByCategory" />
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed } from 'vue'
import MenuBar from '@/components/MenuBar.vue'
import SearchBar from '@/components/SearchBar.vue'
import DebateList from '@/components/DebateList.vue'
import CategorySelector from '@/components/CategorySelector.vue'
import { Api } from '@/Api'

export default {
  components: {
    MenuBar,
    SearchBar,
    DebateList,
    CategorySelector
  },
  setup() {
    const debates = ref([])
    const selectedCategory = ref('')

    const filteredDebates = computed(() => {
      if (selectedCategory.value) {
        return debates.value.filter(debate => debate.category === selectedCategory.value)
      }
      return debates.value
    })

    async function updateDebates(results) {
      debates.value = results
    }

    async function filterDebatesByCategory(category) {
      selectedCategory.value = category
      try {
        const response = await Api.get(`/v1/debates?category=${category}`)
        debates.value = response.data.debates
      } catch (error) {
        console.error('Error fetching debates:', error)
        debates.value = []
      }
    }

    return {
      filteredDebates,
      updateDebates,
      filterDebatesByCategory
    }
  }
}
</script>

<style scoped>
.container-fluid {
  background-color: #f0f0f0;
}

.menu-bar, .main-content, .category-selector {
  padding: 20px;
}

@media (max-width: 767px) {
  .menu-bar, .category-selector {
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