<template>
  <div class="page-layout">
    <div class="h-100" style="width: 250px">
      <MenuBar />
    </div>
    <div class="main-content">
<!--      <EditProfileForm />-->
      <DebateList :searchResults="getUserDebates" />
    </div>
    <div class="leaderboard">
      <Leaderboard />
    </div>
  </div>
</template>

<script>
import DebateList from "@/components/debates/DebateList.vue";
import SearchBar from "@/components/top-bar/SearchBar.vue";
import Leaderboard from "@/components/Filters.vue";
import MenuBar from "@/components/MenuBar.vue";

export default{
  name: 'Profile',
  components: {MenuBar, Leaderboard, SearchBar, DebateList},
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
