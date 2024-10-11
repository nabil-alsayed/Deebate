<template>
  <div class="d-flex w-100 vh-100 column-gap-3 p-3">
    <div class="menu-bar">
      <MenuBar />
    </div>
    <div class="d-flex flex-column main-content flex-grow-1 row-gap-3">
      <!-- SEARCH -->
      <SearchBar />
      <!-- DEBATE LIST AND WIDGETS -->
      <div class="d-flex flex-row column-gap-3 ">
        <!-- DEBATE LIST -->
        <div class="d-flex flex-column row-gap-3 w-100 h-100">
          <DebateForm />
          <DebateList page="profile"/>
        </div>
        <!-- WIDGETS -->
          <EditProfile />
      </div>
    </div>
  </div>
</template>

<script>
import DebateList from "@/components/debates/DebateList.vue";
import SearchBar from "@/components/top-bar/SearchBar.vue";
import EditProfile from '@/components/EditProfile.vue'
import MenuBar from "@/components/MenuBar.vue";
import DebateForm from "@/components/debates/DebateForm.vue";

export default{
  name: 'Profile',
  components: {DebateForm, MenuBar, EditProfile, SearchBar, DebateList},
  data(){
    return{
      userDebates: [],
      userId: ''
    }
  },
  mounted() {
    this.userId = localStorage.getItem('userId')
  },
  methods: {
    getUserDebates(){

    }
  }
}
</script>

<style scoped>
.main-content {
  display: flex;
  flex-direction: column;
  overflow-y: auto;
}
</style>
