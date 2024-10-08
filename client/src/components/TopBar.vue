<script>

import SearchBar from "@/components/top-bar/SearchBar.vue";
import UserMenu from "@/components/top-bar/UserMenu.vue"
import { getLoggedInUser } from "@/api/v1/usersApi.js";

export default {
  name: 'TopBar',
  components: { SearchBar, UserMenu },
  data() {
    return {
      searchQuery: '',
      searchResults: [],
      user: null,
    }
  },
  async mounted() {
    // Fetch the logged-in user's data and assign it to the user data property
    try {
      this.user = await getLoggedInUser();
      console.log("Logged-in user:", this.user);
    } catch (error) {
      console.error("Failed to load user:", error);
    }
  },
  methods: {},
}
</script>

<template>
  <div class="d-flex column-gap-2 justify-content-between">
    <div style="width: max(700px)">
      <search-bar @search-results="searchResults" />
    </div>
    <user-menu v-if="user" :user="user"  />
  </div>
</template>

<style scoped>

</style>
