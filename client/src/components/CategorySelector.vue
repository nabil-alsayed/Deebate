<template>
  <div style="width: 100%">
    <h2 style="color: grey; font-size: 20px; font-weight: 550;">Category</h2>
    <div class="category-grid">
      <div
        v-for="category in categories"
        :key="category.name"
        class="category-card"
        @click="selectCategory(category.name)"
      >
        <div class="icon-container" :class="{ 'active': category.name === activeCategory }">
          <i :class="category.icon" style="font-size: 24px;"></i>
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
        { name: 'Social Issues', icon: 'fas fa-leaf' },
      ],
      activeCategory: ''
    };
  },
  mounted() {
    if (this.activeCategory) {
      this.$emit('category-selected', this.activeCategory);
    }
  },
  methods: {
    selectCategory(category) {
      if (category === this.activeCategory) {
        this.activeCategory = '';
        // Emit empty string if category deselected
        this.$emit('category-selected', '');
      } else {
        this.activeCategory = category;
        // Emit selected category
        this.$emit('category-selected', category);
      }
    }
  }
}
</script>


<style scoped>

.category-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 10px;
}

.category-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  cursor: pointer;
  padding: 15px;
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
