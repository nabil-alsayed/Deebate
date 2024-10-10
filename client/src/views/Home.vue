<template>
  <div class="container-fluid" style="margin-top: 10px;">
    <div class="row">
      <div class="col-md-3 menu-bar">
        <MenuBar />
      </div>
      <div class="col-md-6 main-content">
        <SearchBar @search="updateSearchQuery" />
        <!-- Pass the filtered debates to DebateList -->
        <DebateList :debates="filteredDebates" />
      </div>
      <div class="col-md-3 category-selector">
        <!-- Listen for category selection from CategorySelector -->
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
    const debates = ref([]) // Holds all debates fetched from API
    const selectedCategory = ref('') // Holds selected category
    const searchQuery = ref('') // Holds search query

    // Computed property to filter debates based on category and search query
    const filteredDebates = computed(() => {
      return debates.value.filter(debate => {
        const matchesCategory = !selectedCategory.value || debate.category === selectedCategory.value
        const matchesSearch = !searchQuery.value || debate.topic.toLowerCase().includes(searchQuery.value.toLowerCase())
        return matchesCategory && matchesSearch
      })
    })

    // Fetch debates from API when component is created
    async function fetchDebates() {
      try {
        const response = await Api.get('/v1/debates')
        debates.value = response.data.debates // Store fetched debates
      } catch (error) {
        console.error('Error fetching debates:', error)
        debates.value = [] // Fallback in case of error
      }
    }

    // Handle category selection from CategorySelector
    function filterDebatesByCategory(category) {
      selectedCategory.value = category // Set selected category
    }

    // Handle search query update
    function updateSearchQuery(query) {
      searchQuery.value = query // Set search query
    }

    // Fetch debates on component creation
    fetchDebates()

    return {
      filteredDebates,
      filterDebatesByCategory,
      updateSearchQuery
    }
  }
}
</script>
