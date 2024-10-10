<template>
  <div class="category-selector">
    <h2>Category</h2>
    <div class="category-grid">
      <div v-for="category in categories" :key="category.name" class="category-card" @click="selectCategory(category.name)">
        <div class="icon-container" :class="{ 'active': category.name === activeCategory }">
          <i :class="category.icon"></i>
        </div>
        <div class="category-name">{{ category.name }}</div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'CategorySelector',
  data() {
    return {
      categories: [
        { name: 'Health', icon: 'fas fa-flask' },
        { name: 'Education', icon: 'fas fa-brain' },
        { name: 'Technology', icon: 'fas fa-chart-line' },
        { name: 'Sports', icon: 'fas fa-football-ball' },
        { name: 'Politics', icon: 'fas fa-landmark' },
        { name: 'Social Issues', icon: 'fas fa-leaf' }
      ],
      activeCategory: ''
    }
  },
  methods: {
    selectCategory(category) {
      this.activeCategory = category // Set active category
      this.$emit('category-selected', category) // Emit selected category
    }
  }
}
</script>

<style scoped>
.category-selector {
  background-color: white;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  padding: 15px;
}

.category-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 15px;
}

.category-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  cursor: pointer;
  padding: 10px;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  transition: all 0.3s ease;
}

.category-card:hover {
  background-color: #f0f0f0;
}

.icon-container {
  width: 50px;
  height: 50px;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 50%;
  background-color: #f0f0f0;
  margin-bottom: 5px;
}

.icon-container.active {
  background-color: #4CAF50;
  color: white;
}

.category-name {
  font-size: 14px;
  text-align: center;
}
</style>
