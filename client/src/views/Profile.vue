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
          <DebateList :user="userId" page="profile"/>
        </div>
        <!-- WIDGETS -->
        <div class="right-bar" style="min-width: 250px">
          <EditProfile />
        </div>
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
import {ref, onMounted} from "vue";
import router from "@/router.js";

export default{
  name: 'Profile',
  components: {DebateForm, MenuBar, EditProfile, SearchBar, DebateList},
  setup() {
    const userId = ref('');

    const checkUserSession = async () => {
      const userData = localStorage.getItem('user');

      if (userData) {
        userId.value = JSON.parse(userData)._id;
      } else {
        // If no user data in localStorage, redirect to login page
        await router.replace('/login');
      }
    };

    return {
      userId,
      checkUserSession
    };
  },
  created() {
    this.checkUserSession();
  }
}
</script>

<style scoped>
.main-content {
  display: flex;
  flex-direction: column;
  overflow-y: auto;
}

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
