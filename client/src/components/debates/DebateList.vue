<template>
  <div class="debate-list">
    <h2>{{ debates.length }} Debates</h2>
    <ul v-if="debates.length">
        <li v-for="debate in debates" :key="debate._id" class="debate-item">
          <debate-item
            :key="debate._id"
            :topic="debate.topic"
            :endTime="debate.endTime"
            :status="debate.status"
            :category="debate.category"
            :participants="debate.participants"
            :maxParticipants="debate.maxParticipants"
            :arguments="debate.arguments"
            :creator="debate.creator"
          />
        </li>
      </ul>
    <p v-else>No such debates.</p>
    <div v-if="error" class="error-message">
      {{ error }}
    </div>
  </div>
</template>

<script>
import { Api } from '@/Api.js'
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
    getDebates() {
      Api.get('/v1/debates')
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
    },
    followDebate(debateId) {
      console.log(`Following debate with ID: ${debateId}`)
      // Implement API call to follow the debate
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

  .debate-header {
    display: flex;
    justify-content: space-between;
    margin-bottom: 10px;
  }

  .debate-time {
    color: #888;
  }

  .debate-status {
    padding: 3px 8px;
    border-radius: 12px;
    font-size: 0.8em;
  }

  .debate-status.open {
    background-color: #4CAF50;
    color: white;
  }

  .debate-status.closed {
    background-color: #F44336;
    color: white;
  }

  .debate-status.locked {
    background-color: #FFC107;
    color: black;
  }

  .debate-category {
    display: inline-block;
    background-color: #007769;
    color: white;
    padding: 3px 8px;
    border-radius: 10px;
    font-size: 1em;
    margin-bottom: 10px;
  }

  .debate-info, .debate-arguments {
    margin-bottom: 10px;
  }

  .debate-btn, .follow-btn {
    width: 100%;
    padding: 10px;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    font-weight: bold;
  }

  .debate-btn {
    background-color: #007769;
    color: white;
  }

  .follow-btn {
    background-color: #FFC107;
    color: black;
  }

  .debate-btn:hover {
    background-color: #005a5a;
  }

  .follow-btn:hover {
    background-color: #FFA000;
  }

  .error-message {
    color: red;
    margin-top: 20px;
  }
</style>
