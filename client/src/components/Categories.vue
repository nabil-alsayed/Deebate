<template>
  <div class="categories">
    <h3>Categories</h3>
    <div class="category-grid">
      <div class="category" v-for="category in categories" :key="category.id">
        <img :src="category.icon" alt="Category Icon" />
        <span>{{ category.name }}</span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      categories: [
        { id: 1, name: 'Science', icon: '@/assets/science-icon.svg' },
        { id: 2, name: 'Philosophy', icon: '@/assets/philosophy-icon.svg' },
        { id: 3, name: 'Finance', icon: '@/assets/finance-icon.svg' },
        { id: 4, name: 'Sport', icon: '@/assets/sport-icon.svg' },
        { id: 5, name: 'Politics', icon: '@/assets/politics-icon.svg' },
        { id: 6, name: 'Environment', icon: '@/assets/environment-icon.svg' }
      ]
    }
  }
}
</script>

<style scoped>
.categories {
  margin-top: 20px;
}

.category-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 10px;
}

.category {
  background-color: white; /* White */
  border-radius: 20px; /* Rounded corners */
  padding: 10px;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
}
</style>
