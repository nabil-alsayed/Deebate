<template>
  <div style="width: 100%; position: sticky; top: 0">
    <h2 class="title">Category</h2>
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
        { name: 'Health', icon: 'fas fa-heart-pulse' },
        { name: 'Education', icon: 'fas fa-book' },
        { name: 'Technology', icon: 'fas fa-microchip' },
        { name: 'Sports', icon: 'fas fa-football-ball' },
        { name: 'Politics', icon: 'fas fa-landmark' },
        { name: 'Social Issues', icon: 'fas fa-people-group' },
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
  border-radius: 15px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  font-weight: 800;
  color: #017769;
}

.category-card:hover {
  background-color: #017769;
  color: white;
}

.icon-container {
  width: 50px;
  height: 50px;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 50%;
  margin-bottom: 5px;
}

.icon-container.active {
  background-color: #16B671;
  color: white;
}

.icon-container {
  background-color: #f6f6f6;
  color: #16B671;
}

.category-name {
  font-size: 13px;
  text-align: center;
}

.title {
  color: grey;
  font-size: 18px;
  font-weight: 550;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

@media (max-width: 850px) {
  .category-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}

@media (max-width: 576px) {

  .category-grid {
    grid-template-columns: repeat(6, 120px);
    grid-template-rows: repeat(1, 120px);
    overflow: hidden;
    overflow-x: scroll;
    scrollbar-width: none;
  }
}

</style>
