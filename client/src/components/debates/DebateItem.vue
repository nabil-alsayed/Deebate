<template>
  <div class="d-flex flex-column row-gap-1">
    <!-- header -->
    <div class="d-flex flex-row justify-content-between">
      <div v-if="status !== 'closed'">
        <h3 class="fw-bold" style="font-size: small;">{{ endTime }}</h3>
      </div>
      <i class="bi bi-three-dots-vertical"></i>
    </div>

    <div class="text-start">
      <!-- Title -->
      <h1 class="fs-4 fw-bold">{{ topic }}</h1>
      <!-- Category Tag -->
      <div class="d-inline-block bg-success px-3 rounded text-white fw-bold" style="font-size: 14px;">
        <p class="m-0">{{ category }}</p>
      </div>
       <!-- Arguments -->
       <div v-if="arguments.length > 0">
        <!-- List of Arguments -->
        <div v-for="argument in arguments" :key="argument._id">
          <!-- Argument Card -->
          <div>
           {{ argument.content }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>



<script>
import { Api } from "@/api/v1/Api.js";
import avatar from "../../../assets/avatars/avatar.png";

export default {
  name: 'DebateItem',
  props: {
    _id: String,
    topic: String,
    endTime: String,
    status: String,
    category: String,
    participants: Array,
    maxParticipants: Number,
    arguments: Array,
    creator: String,
  },
  data() {
    return {
      creatorName: null,
      debatorName: null,
      arguments: [],
    };
  },
  mounted() {
    this.getCreator();
    this.getDebator();
    this.getArguments();
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
      if (this.creator) {
        Api.get(`/users/${this.creator}`, {
          headers: {
            Authorization: `Bearer ${this.token}`,
          },
        })
          .then((response) => {
            this.creatorName = response.data.username;
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
        Api.get(`/users/${debatorId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
          .then((response) => {
            this.debatorName = response.data.user.username;
          })
          .catch((error) => {
            console.error("Error fetching debator:", error);
            this.debatorName = "Unknown";
          });
      } else {
        this.debatorName = "Unknown";
      }
    },

    async getArguments() {
      const token = this.getToken();
      console.log(token);
      console.log(this._id);

      try {
        const fetchedArguments = await Api.get(`/debates/${this._id}/arguments/`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        console.log("Arguments: ", fetchedArguments.data);

        this.arguments = fetchedArguments.data;
      } catch (error) {
        console.error("Error fetching arguments:", error);
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


<style scoped></style>
