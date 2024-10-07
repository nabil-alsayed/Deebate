<template>
  <div class="d-flex w-100 vh-100 column-gap-2 p-3">
    <!--    MENU -->
    <MenuBar />
    <!-- MAIN CONTENT -->
    <div class="main-content flex-grow-1 column-gap-2">
      <!-- SEARCH -->
      <SearchBar @search-results="updateDebates" />
      <!-- DEBATE LIST AND WIDGETS -->
      <div class="d-flex">
        <!-- DEBATE LIST -->
          <div class="w-100">
            <DebateForm />
            <DebateList :searchResults="searchResults" />
          </div>
        <!-- WIDGETS -->
        <div style="width: 350px">
          <Widgets />
        </div>
      </div>
    </div>
  </div>
</template>

<script>

import MenuBar from '@/components/MenuBar.vue'
import SearchBar from '@/components/top-bar/SearchBar.vue'
import DebateList from '@/components/debates/DebateList.vue'
import Widgets from "@/components/Widgets.vue";
import DebateForm from "@/components/debates/DebateForm.vue";

export default {
  name: 'Home',
  components: {
    DebateForm,
    Widgets,
    SearchBar,
    DebateList,
    MenuBar,
  },
  data() {
    return {
      debates: [],
      searchQuery: '',
      searchResults: [],
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

 .main-content {
   display: flex;
   flex-direction: column;
   overflow-y: auto;
 }

</style>
