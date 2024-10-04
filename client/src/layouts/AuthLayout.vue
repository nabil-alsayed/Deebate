<template>
  <div class="auth-layout flex-grow-1 d-flex justify-content-center align-items-center vh-100">
    <!-- Router view for authentication pages like login, signup -->
    <Login />
  </div>
</template>

<script setup lang="ts">
import Login from "@/views/Login.vue";
</script>

<style scoped>
.auth-layout {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
}
</style>
