<template>
  <div class="debate-list">
    <h2>{{ debates.length }} Debates</h2>
    <ul v-if="debates.length">
      <li v-for="debate in debates" :key="debate._id" class="debate-item">
        <div class="debate-header">
          <span class="debate-time">{{ getTimeLeft(debate.endTime) }}</span>
          <span :class="['debate-status', debate.status]">{{ debate.status }}</span>
        </div>
        <h3>{{ debate.topic }}</h3>
        <div class="debate-category">{{ debate.category }}</div>
        <div class="debate-info">
          <span>Participants: {{ debate.participants.length }} / {{ debate.maxParticipants }}</span>
        </div>
        <div class="debate-arguments">
          Arguments: {{ debate.arguments.length }}
        </div>
        <button
          v-if="debate.status === 'open' && debate.participants.length < debate.maxParticipants"
          class="debate-btn"
          @click="joinDebate(debate._id, debate.creator)"
        >
          Press to debate against {{ debate.creator }}
        </button>
        <button
          v-else-if="debate.status === 'open' && debate.participants.length === debate.maxParticipants"
          class="follow-btn"
          @click="followDebate(debate._id)"
        >
          Follow the debate
        </button>
      </li>
    </ul>
    <p v-else>No debates available in this category.</p>
    <div v-if="error" class="error-message">{{ error }}</div>
  </div>
</template>

<script>
export default {
  name: 'DebateList',
  props: {
    debates: {
      type: Array,
      required: true // Accepts filtered debates from HomePage
    }
  },
  methods: {
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
.debate-list {
  margin-top: 20px;
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
  font-size: 0.85em;
  margin-bottom: 8px;
}

.debate-btn, .follow-btn {
  display: block;
  background-color: #007bff;
  color: white;
  border: none;
  padding: 10px 15px;
  border-radius: 5px;
  cursor: pointer;
}

.follow-btn {
  background-color: #28a745;
}
</style>
