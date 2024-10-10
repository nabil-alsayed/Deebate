<template>
  <div class="d-flex w-100 vh-100 column-gap-3 p-3">
    <!--    MENU -->
    <MenuBar />
    <!-- MAIN CONTENT -->
    <div class="main-content flex-grow-1 column-gap-2 row-gap-3">
      <!-- SEARCH -->
      <top-bar @search-results="updateDebates" />
      <!-- DEBATE LIST AND WIDGETS -->
      <div class="d-flex">
        <!-- DEBATE LIST -->
          <div id="debates-sections">
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
import TopBar from "@/components/TopBar.vue";

export default {
  name: 'Home',
  components: {
    TopBar,
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
  methods: {
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

 #debates-sections {
   display: flex;
   flex-direction: column;
   width: 100%;
 }

</style>
