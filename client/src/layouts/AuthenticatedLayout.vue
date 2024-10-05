<template>
  <div class="d-flex flex-grow-1 vh-100">
    <!-- Sidebar for authenticated users -->
    <div class="sidebar p-3">
      <menu-bar />
    </div>

    <!-- Main content area -->
    <div class="flex-grow-1 p-3">
      <top-bar />
      <router-view />
    </div>
  </div>
</template>

<script setup>
import MenuBar from "@/components/MenuBar.vue";
import TopBar from "@/components/TopBar.vue";
</script>

<style scoped>
.sidebar {
  width: 250px;
}

.flex-grow-1 {
  flex-grow: 1;
}
</style>
