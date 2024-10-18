<template>
  <div class="d-flex flex-column full-width row-gap-1" style="width: 100%">
    <div
      class="d-flex flex-row justify-content-between align-items-center"
      style="color: grey"
    >
      <h2 class="title">{{ debates.length }} Debates</h2>
      <div class="d-flex flex-row column-gap-2 align-items-center justify-content-center"
           style="font-size: 20px"
      >
        <div class="d-flex flex-row column-gap-2 justify-content-center align-items-center"
             @click="toggleSort" style="cursor: pointer;">
          <h2 class="title">End Time</h2>
          <i :class="['bi', sortOrder === 'asc' ? 'bi-sort-up' : 'bi-sort-up inactive']"></i>
          <i :class="['bi', sortOrder === 'desc' ? 'bi-sort-down' : 'bi-sort-down inactive']"></i>
        </div>
      </div>
    </div>
    <ul v-if="debates.length">
      <li v-for="debate in debates" :key="debate._id" class="debate-item">
        <debate-item :debateObj="debate" :key="debate._id" />
      </li>
    </ul>
    <div v-else class="empty-list">
      <img :src="EmptyListIllustration" alt="empty" style="width: 300px; height: 300px" />
      <p>Wooopsy. No debates yet!</p>
    </div>
  </div>
</template>

<script>
import { Api } from '@/api/v1/Api.js';
import DebateItem from '@/components/debates/DebateItem.vue';
import EmptyListIllustration from '@/assets/illustrations/debate-list-empty.svg';

export default {
  name: 'DebateList',
  components: { DebateItem },
  props: {
    filteredDebates: {
      type: Array,
      default: () => [],
    },
    user: {
      type: String,
      default: null,
    },
  },
  data() {
    return {
      debates: [],
      error: null,
      sortOrder: 'desc',
      EmptyListIllustration,
    };
  },
  watch: {
    filteredDebates(newResults) {
      this.debates = newResults;
    },
  },
  mounted() {
    localStorage.removeItem('selectedCategory');
    this.selectedCategory = null;
    this.getDebates();
  },
  methods: {

    getDebates() {
      const userQuery = this.user ? `user=${this.user}&` : '';
      const sortQuery = `sort=${this.sortOrder}`;
      Api.get(`/debates?${userQuery}${sortQuery}`)
        .then((response) => {
          console.log(response.data.debates);
          this.debates = response.data.debates;
        })
        .catch((error) => {
          console.error(error);
          this.error = 'An error occurred while fetching debates. Please try again later.';
        });
    },

    toggleSort() {
      this.sortOrder = this.sortOrder === 'asc' ? 'desc' : 'asc';
      this.getDebates();
    },
  },
};
</script>

<style scoped>
ul,
li {
  list-style-type: none;
  margin: 0;
  padding: 0;
}

.full-width {
  width: 100%;
}

.empty-list {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 400px;
  font-weight: 650;
  font-size: 25px;
  color: grey;
}

.debate-item {
  background-color: white;
  border: 0.5px solid #dad9d9;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  border-radius: 15px;
  padding: 15px;
  margin-bottom: 15px;
}

.title {
  color: grey;
  font-size: 18px;
  font-weight: 550;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.inactive {
  display: none;
}
</style>
