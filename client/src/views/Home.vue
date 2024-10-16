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
      <div class="d-flex flex-row column-gap-3">
        <!-- DEBATE LIST -->
        <div class="d-flex flex-column row-gap-3" id="debates-sections">
          <DebateForm />
          <DebateList :filteredDebates="filteredDebates" />
        </div>

        <!-- Right side Widgets (CategorySelector and ChatGptWidget) -->
        <div class="right-bar d-flex flex-column row-gap-3" style="min-width: 250px">
          <CategorySelector @category-selected="filterDebatesByCategory" />
          <ChatGptWidget />
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
import SearchBar from '@/components/top-bar/SearchBar.vue';
import ChatGptWidget from '@/components/ChatGptWidget.vue';

export default {
  name: 'Home',
  components: {
    SearchBar,
    MenuBar,
    DebateForm,
    DebateList,
    CategorySelector,
    EditProfile,
    ChatGptWidget,
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

#debates-sections {
  width: 100%;
}

/* Responsive */

@media (max-width: 768px) {
  .right-bar {
    display: none;
  }
}

@media (max-width: 576px) {
  .menu-bar {
    display: none;
  }
}

.right-bar {
  display: flex;
  flex-direction: column;
}

/* Responsive */

@media (max-width: 768px) {
  .right-bar {
    display: none;
  }
}

@media (max-width: 576px) {
  .menu-bar {
    display: none;
  }
}
</style>
