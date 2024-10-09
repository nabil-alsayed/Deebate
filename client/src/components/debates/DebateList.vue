<template>
  <div class="debate-list">
    <h2>{{ debates.length }} Debates</h2>
    <ul v-if="debates.length">
        <li v-for="debate in debates" :key="debate._id" class="debate-item">
          <debate-item :debateObj="debate" :key="debate._id"/>
        </li>
      </ul>
    <p v-else>No such debates.</p>
    <div v-if="error" class="error-message">
      {{ error }}
    </div>
  </div>
</template>

<script>
import { Api } from '@/api/v1/Api.js'
import DebateItem from "@/components/debates/DebateItem.vue";

export default {
  name: 'DebateList',
  components: {DebateItem},
  props: {
    searchResults: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      debates: [],
      error: null
    }
  },
  watch: {
    searchResults(newResults) {
      this.debates = newResults
    }
  },
  created() {
    this.getDebates()
  },
  methods: {
    //TODO: Move to Api file
    getDebates() {
      Api.get('/debates')
        .then(response => {
          console.log(response.data.debates);
          this.debates = response.data.debates;
        })
        .catch(error => {
          console.error(error);
          this.error = 'An error occurred while fetching debates. Please try again later.';
        });
    },
    getTimeLeft(endTime) {
      const now = new Date()
      const end = new Date(endTime)
      const diff = end - now

      if (diff <= 0) {
        return 'Ended'
      }

      const days = Math.floor(diff / (1000 * 60 * 60 * 24))
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))

      return `${days}d ${hours}h ${minutes}m`
    },
    joinDebate(debateId, opponent) {
      console.log(`Joining debate with ID: ${debateId} against ${opponent}`)
      // Implement API call to join the debate
    }
  }
}
</script>

<style scoped>

ul, li {
  list-style-type: none;
  margin: 0;
  padding: 0;
}
  .debate-list {
      margin-top: 20px;
      width: 100%;
    }

  .debate-item {
    background-color: white;
    border: 1px solid #e0e0e0;
    border-radius: 8px;
    padding: 15px;
    margin-bottom: 15px;
  }

  .error-message {
    color: red;
    margin-top: 20px;
  }
</style>
