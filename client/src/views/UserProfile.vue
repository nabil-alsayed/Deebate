<template>
  <div class="main-container-userprofile w-100 vh-100 column-gap-3 p-3">
    <div class="menu-bar">
      <MenuBar />
    </div>
    <div class="d-flex flex-column main-content flex-grow-1 row-gap-3">
      <!-- SEARCH -->
      <SearchBar />

      <!-- ProfileInfo and DebateList linked to the updated userId -->
      <div class="right-bar d-flex flex-column row-gap-4" style="min-width: 250px">
        <ProfileInfo :user-id="userId" />
        <DebateList :user="userId" />
      </div>
    </div>
  </div>
</template>

<script>
import DebateList from "@/components/debates/DebateList.vue";
import SearchBar from "@/components/top-bar/SearchBar.vue";
import MenuBar from "@/components/MenuBar.vue";
import ProfileInfo from "@/components/ProfileInfo.vue";
import { ref, watch } from "vue";
import {useRoute} from "vue-router";

export default {
  name: "UserProfile",
  components: {DebateList, MenuBar, ProfileInfo, SearchBar},
  setup() {
    const route = useRoute();
    const userId = ref(route.params.userId);

    // Watch for changes in the route's userId and update accordingly
    watch(
      () => route.params.userId,
      (newUserId) => {
        userId.value = newUserId;
      }
    );

    return {
      userId,
    };
  },
};
</script>

<style scoped>
.main-container-userprofile {
  display: flex;
  flex-direction: row;
  column-gap: 15px;
}

.main-content {
  display: flex;
  flex-direction: column;
  overflow-y: auto;
}

@media (max-width: 992px) {
  .right-bar {
    display: none;
  }

  .main-container-userprofile {
    flex-direction: column;
    row-gap: 15px;
  }
}
</style>
