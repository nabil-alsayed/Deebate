<template>
  <div class="d-flex w-100 vh-100 column-gap-3 p-3">
    <div class="menu-bar">
      <MenuBar />
    </div>
    <div class="d-flex flex-column main-content flex-grow-1 row-gap-3">
      <!-- SEARCH -->
      <SearchBar />

      <!-- ProfileInfo -->
      <div class="right-bar d-flex flex-column row-gap-4" style="min-width: 250px">
        <ProfileInfo />
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
import { ref } from "vue";
import { useRoute } from "vue-router";

export default {
  name: "UserProfile",
  components: { DebateList, MenuBar, ProfileInfo, SearchBar },
  setup() {
    const route = useRoute();
    const userId = ref(route.params.userId);

    return {
      userId,
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
