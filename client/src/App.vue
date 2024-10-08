<template>
  <div id="app" class="d-flex vh-100 vw-100">
    <!-- Conditionally render either the authenticated layout or the auth layout -->
    <router-view/>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";


// Check if the user is authenticated by the presence of the token
const isAuth = computed(() => {
  try {
    return !!localStorage.getItem('token');
  } catch (error) {
    console.error("Error checking authentication:", error);
    return false;
  }
});
</script>

<style>
#app {
  font-family: Inter, Rubik, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  background-color: #E7E7E7;
}

.d-flex {
  display: flex;
}
</style>
