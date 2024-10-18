<template>
  <div class="d-flex w-100 vh-100 column-gap-3 p-3">
    <!--    MENU -->
    <div class="menu-bar">
      <MenuBar />
    </div>

    <!-- MAIN CONTENT -->
    <div class="main-content flex-grow-1 flex-column row-gap-3">
      <!-- SEARCH AND USER INFO -->
      <SearchBar />
      <!-- DEBATE LIST AND WIDGETS -->
      <div class="main-body">
        <!-- DEBATE LIST -->

        <div class="d-flex flex-column row-gap-3" id="debates-sections">
          <div class="d-flex flex-column row-gap-1">
            <h2 class="title">Post a Debate</h2>
            <DebateForm />
          </div>
          <DebateList :filteredDebates="filteredDebates" />
        </div>

        <!-- Right side Widgets (CategorySelector or EditProfile) -->
        <div class="right-bar" style="min-width: 250px">
          <CategorySelector @category-selected="filterDebatesByCategory" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted, watch } from 'vue';
import { Api } from '@/api/v1/Api.js';
import MenuBar from '@/components/MenuBar.vue';
import DebateForm from '@/components/debates/DebateForm.vue';
import DebateList from '@/components/debates/DebateList.vue';
import CategorySelector from '@/components/CategorySelector.vue';
import EditProfile from '@/components/EditProfile.vue';
import SearchBar from '@/components/top-bar/SearchBar.vue'

export default {
  name: 'Home',
  components: {
    SearchBar,
    MenuBar,
    DebateForm,
    DebateList,
    CategorySelector,
    EditProfile,
  },
  setup() {
    const debates = ref([]);
    const selectedCategory = ref(localStorage.getItem('selectedCategory') || ''); // Initially, fetch from localStorage if exists

    // Fetch debates from API
    const fetchDebates = async () => {
      try {
        const categoryQuery = selectedCategory.value ? `?category=${selectedCategory.value}` : '';
        const response = await Api.get(`/debates${categoryQuery}`);
        debates.value = response.data.debates;
      } catch (error) {
        console.error('Error fetching debates:', error);
        debates.value = [];
      }
    };

    // Filter debates based on selected category and search query
    const filteredDebates = computed(() => {
      let filtered = debates.value;

      if (selectedCategory.value) {
        filtered = filtered.filter(debate => debate.category === selectedCategory.value);
      }

      return filtered;
    });

    // Watch for changes in selected category and fetch debates accordingly
    watch(selectedCategory, (newCategory) => {
      localStorage.setItem('selectedCategory', newCategory); // Save category in localStorage
      fetchDebates(); // Refetch debates based on new category
    });

    // Fetch all debates on component mount
    onMounted(fetchDebates);

    // Method to update category from CategorySelector
    const filterDebatesByCategory = (category) => {
      selectedCategory.value = category;
    };

    return {
      debates,
      filteredDebates,
      filterDebatesByCategory,
    };
  },
};
</script>


<style scoped>
.main-content {
  display: flex;
  flex-direction: column;
  overflow-y: auto;
}

.title {
  color: grey;
  font-size: 18px;
  font-weight: 550;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

#debates-sections {
  width: 100%;
}

.main-body {
  display: flex;
  flex-direction: row;
  column-gap: 15px;
}

/* Responsive */

@media (max-width: 850px) {

  .main-body {
    flex-direction: column;
    row-gap: 15px;
  }

  .right-bar {
    order: -1;
  }
}

@media (max-width: 576px) {
  .menu-bar {
    display: none;
  }

  .main-body {
    flex-direction: column;
  }

}
</style>
