<template>
  <div class="page-layout">
    <!-- Main Content (Debates) -->
    <div class="main-content">
      <EditProfile v-if="currentView === 'profile'" />
    </div>
  </div>
</template>

<script>
import EditProfile from '@/components/EditProfile.vue'

export default {
  components: {
    EditProfile
  },
  data() {
    return {
      currentView: 'profile'
    }
  }
}
</script>

<style scoped>
.page-layout {
  display: grid;
  grid-template-columns: 1fr 3fr 1.5fr;
  grid-gap: 20px;
}

.main-content {
  padding: 20px;
}
</style>
