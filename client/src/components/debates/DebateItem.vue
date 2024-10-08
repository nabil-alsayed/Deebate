<template>
  <li class="debate-item">
    <div class="debate-header">
      <span class="debate-time">{{ getTimeLeft(endTime) }}</span>
      <span :class="['debate-status', status]">{{ status }}</span>
    </div>
    <h3>{{ topic }}</h3>
    <div class="debate-category">{{ category }}</div>
    <div class="debate-info">
      <span>Participants: {{ participants.length }} / {{ maxParticipants }}</span>
    </div>
    <div class="debate-arguments">
      Arguments: {{ arguments.length }}
    </div>

    <!-- Display creator if the debate is created by them -->
    <p v-if="creatorName">Created by: {{ creatorName }}</p>

    <!-- Display debator if they are participating -->
    <p v-if="debatorName">Debating against: {{ debatorName }}</p>

    <!-- Join debate button logic -->
    <button
      v-if="status === 'open' && participants.length < maxParticipants"
      class="debate-btn"
      @click="joinDebate(_id, debatorName || creatorName)"
    >
      Press to debate against {{ debatorName || creatorName || 'someone'}}
    </button>

    <!-- Follow debate button logic -->
    <button
      v-else-if="status === 'open' && participants.length === maxParticipants"
      class="follow-btn"
      @click="followDebate(_id)"
    >
      Follow the debate
    </button>
  </li>
</template>



<script>
import { Api } from "@/api/v1/Api.js";

export default {
  name: 'DebateItem',
  props: {
    _id: String,
    topic: String,
    endTime: String,
    status: String,
    category: String,
    participants: Array, // The participants array
    maxParticipants: Number,
    arguments: Array,
    creator: String, // The creator's ID
  },
  data() {
    return {
      creatorName: null,  // Name of the debate creator
      debatorName: null,  // Name of the participant (debator)
    };
  },
  mounted() {
    this.getCreator();
    this.getDebator();
  },
  methods: {
    getTimeLeft(endTime) {
      const now = new Date();
      const end = new Date(endTime);
      const diff = end - now;

      if (diff <= 0) {
        return 'Ended';
      }

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

      return `${days}d ${hours}h ${minutes}m`;
    },
    getToken() {
      return localStorage.getItem('token');
    },

    // Fetch creator details
    getCreator() {
      const token = this.getToken();
      if (this.creator) {
        Api.get(`/v1/users/${this.creator}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
          .then((response) => {
            this.creatorName = response.data.username; // Store the creator's username
          })
          .catch((error) => {
            console.error("Error fetching creator:", error);
            this.creatorName = "Unknown";
          });
      }
    },

    // Fetch the debator's details (from participants)
    getDebator() {
      const token = this.getToken();
      const debatorId = this.participants[0];
      if (debatorId) {  // Assuming first participant is the debator
        Api.get(`/v1/users/${debatorId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
          .then((response) => {
            this.debatorName = response.data.user.username; // Store the debator's username
          })
          .catch((error) => {
            console.error("Error fetching debator:", error);
            this.debatorName = "Unknown";
          });
      } else {
        this.debatorName = "Unknown";
      }
    },

    joinDebate(debateId, opponent) {
      console.log(`Joining debate with ID: ${debateId} against ${opponent}`);
      // Implement API call to join the debate
    },

    followDebate(debateId) {
      console.log(`Following debate with ID: ${debateId}`);
      // Implement API call to follow the debate
    },
  },
};
</script>


<style scoped>
/* Reuse the same styles from the original debate item */
.debate-item {
  background-color: white;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  padding: 15px;
  margin-bottom: 15px;
}
</style>
