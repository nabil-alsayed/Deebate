<template>
  <div class="d-flex w-100 vh-100 column-gap-2 p-3">
    <div class="h-100" style="width: 250px">
      <MenuBar />
    </div>
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
import DebateList from "@/components/debates/DebateList.vue";
import SearchBar from "@/components/top-bar/SearchBar.vue";
import Leaderboard from "@/components/Filters.vue";
import MenuBar from "@/components/MenuBar.vue";
import DebateForm from "@/components/debates/DebateForm.vue";
import Widgets from "@/components/Widgets.vue";

export default{
  name: 'Profile',
  components: {Widgets, DebateForm, MenuBar, Leaderboard, SearchBar, DebateList},
  data(){
    return{
      debates: [],
      searchQuery: '',
      searchResults: [],
      userId: ''
    }
  },
  computed: {
    getUserDebates(){
      return this.debates.filter(debate =>
        debate.userId === this.userId
      )
    }
  }
}
</script>
