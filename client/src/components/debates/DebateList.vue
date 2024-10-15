<template>
  <div class="d-flex flex-column full-width row-gap-3" style="width: 100%">
    <div
      class="d-flex flex-row justify-content-between align-items-center"
      style="color: grey"
    >
      <h2 style="font-weight: 550; font-size: 17px">{{ debates.length }} Debates</h2>
      <div class="d-flex flex-row column-gap-2 align-items-center justify-content-center"
           style="font-size: 20px"
      >
        <div class="d-flex flex-row column-gap-2 justify-content-center align-items-center">
          <h2 style="font-weight: 550; font-size: 17px">End Time</h2>
          <i class="bi bi-sort-up inactive"></i>
          <i class="bi bi-sort-down"></i>
        </div>
      </div>
    </div>
    <ul v-if="debates.length">
      <li v-for="debate in debates" :key="debate._id" class="debate-item">
        <debate-item :debateObj="debate" :key="debate._id" />
      </li>
    </ul>
    <p v-else>No such debates.</p>
  </div>
</template>

<script>
import { Api } from '@/api/v1/Api.js';
import DebateItem from '@/components/debates/DebateItem.vue';

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
    };
  },
  watch: {
    filteredDebates(newResults) {
      this.debates = newResults;
    },
  },
  created() {
    this.getDebates();
  },
  methods: {
    // Fetch debates, either for a specific user or general
    getDebates() {
      const userQuery = this.user ? `?user=${this.user}` : '';
      Api.get(`/debates${userQuery}`)
        .then((response) => {
          console.log(response.data.debates);
          this.debates = response.data.debates;
        })
        .catch((error) => {
          console.error(error);
          this.error = 'An error occurred while fetching debates. Please try again later.';
        });
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

.debate-item {
  background-color: white;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  padding: 15px;
  margin-bottom: 15px;
}

.inactive {
  display: none;
}
</style>
