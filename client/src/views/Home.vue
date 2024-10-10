<template>
  <div class="container-fluid" style="margin-top: 10px">
    <div class="row">
      <!-- MenuBar on the left side -->
      <div class="col-md-3 menu-bar">
        <MenuBar @profile-clicked="showProfile" @home-clicked="showHome" />
      </div>

      <!-- Main content in the middle -->
      <div class="col-md-6 main-content">
        <SearchBar
          @search-results="updateDebates"
          @userSelected="handleUserSelected"
        />
        <DebateList :debates="filteredDebates" :searchResults="searchResults" />
      </div>

      <!-- Right side for CategorySelector or EditProfile -->
      <div class="col-md-3 right-bar">
        <CategorySelector
          v-if="!showEditProfile"
          @category-selected="filterDebatesByCategory"
        />
        <div v-else>
          <EditProfile />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed } from 'vue'
import MenuBar from '@/components/MenuBar.vue'
import SearchBar from '@/components/SearchBar.vue'
import DebateList from '@/components/DebateList.vue'
import EditProfile from '@/components/EditProfile.vue'
import CategorySelector from '@/components/CategorySelector.vue'
import { Api } from '@/Api'

export default {
  components: {
    MenuBar,
    SearchBar,
    DebateList,
    CategorySelector,
    EditProfile
  },
  setup() {
    const debates = ref([]) // Holds all debates fetched from API
    const selectedCategory = ref('') // Holds selected category
    const searchQuery = ref('') // Holds search query
    const searchResults = ref([]) // Holds search results from SearchBar
    const showEditProfile = ref(false) // Control whether to show EditProfile or DebateList

    // Computed property to filter debates based on category and search query
    const filteredDebates = computed(() => {
      return debates.value.filter((debate) => {
        const matchesCategory =
          !selectedCategory.value || debate.category === selectedCategory.value
        const matchesSearch =
          !searchQuery.value ||
          debate.topic.toLowerCase().includes(searchQuery.value.toLowerCase())
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

    // Handle search query update from SearchBar
    function updateSearchQuery(query) {
      searchQuery.value = query // Set search query
    }

    // Handle search results from SearchBar
    function updateDebates(results) {
      searchResults.value = results
    }

    // Fetch debates on component creation
    fetchDebates()

    return {
      filteredDebates,
      filterDebatesByCategory,
      updateSearchQuery,
      updateDebates,
      searchResults,
      showEditProfile
    }
  },
  data() {
    return {
      isMobile: false
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
    // Show profile editor and hide DebateList
    showProfile() {
      this.showEditProfile = true
    },
    // Show DebateList and hide profile editor
    showHome() {
      this.showEditProfile = false
    }
  }
}
</script>

<style>
.page-layout {
  display: grid;
  grid-template-columns: 300px auto 300px; /* Left sidebar, main content, right sidebar */
  grid-gap: 20px; /* Equal space between columns */
  background-color: #f0f0f0;
}

.desktop-layout {
  grid-template-columns: 300px auto 300px;
}

.mobile-layout {
  grid-template-columns: 1fr;
  padding-top: 70px;
}

.main-content {
  padding: 20px;
  overflow-y: auto;
  background-color: #ffffff;
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
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

/* Responsive */
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
    display: none;
  }
}
</style>
