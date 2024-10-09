<template>
  <div>
    <!-- Header -->
    <div class="d-flex flex-row justify-content-between">
      <div v-if="debate.status !== 'closed'">
        <h3 class="fw-bold" style="font-size: small;">{{ debate.endTime }}</h3>
      </div>
      <i class="bi bi-three-dots-vertical"></i>
    </div>

    <div class="d-flex flex-column text-start">
      <!-- Title -->
      <h1 class="fs-5 fw-bold">{{ debate.topic }}</h1>

      <!-- Category Tag -->
      <div class="d-inline-block bg-success px-3 rounded text-white fw-bold"
           style="font-size: 14px; max-width: fit-content">
        <p class="m-0">{{ debate.category }}</p>
      </div>

      <!-- Arguments List -->
      <arguments-list
        :arguments="debate.arguments.slice(0, argumentsLimit)"
        :debateId="debate._id"
        :userId="userId"
      />

      <!-- Add New Argument -->
      <div class="mt-4">
        <b-form @submit.prevent="addArgument">
          <b-form-textarea
            v-model="newArgument"
            placeholder="Enter your argument here"
            rows="3"
            required
          ></b-form-textarea>
          <button class="btn btn-primary mt-2 w-100" type="submit">Submit Argument</button>
        </b-form>
      </div>

      <!-- Load More Arguments Button -->
      <button v-if="argumentsLimit < debate.arguments.length" @click="loadMoreArguments">
        Load more arguments
      </button>
    </div>

    <!-- Voting Buttons -->
    <div class="d-flex fw-bold rounded text-white justify-content-center align-items-center mt-3">
      <div
        @click="voteWith"
        class="vote-button w-50 d-flex justify-content-center align-items-center"
        :style="withButtonStyle"
      >
        <p class="m-0">Vote With</p>
        <i class="bi bi-arrow-up fs-5 ms-2"></i>
      </div>
      <div
        @click="voteAgainst"
        class="vote-button w-50 d-flex justify-content-center align-items-center"
        :style="againstButtonStyle"
      >
        <p class="m-0">Vote Against</p>
        <i class="bi bi-arrow-down fs-5 ms-2"></i>
      </div>
    </div>
  </div>
</template>

<script>
import {ref, computed, watch} from 'vue';
import ArgumentsList from "@/components/arguments/ArgumentsList.vue";
import {Api} from "@/api/v1/Api.js";
import {getLoggedInUser} from "@/api/v1/usersApi.js";
import debounce from 'lodash.debounce';

export default {
  name: "DebateItem",
  components: {ArgumentsList},
  props: {
    debate: {
      type: Object,
      required: true,
    },
  },
  setup(props) {
    const userId = ref(null);
    const newArgument = ref('');
    const token = localStorage.getItem("token");
    const voteType = ref('');

    const numberOfWithVotes = ref(0);
    const numberOfAgainstVotes = ref(0);
    const argumentsLimit = ref(5);

    const withButtonStyle = computed(() => ({
      backgroundColor: voteType.value === 'with' ? 'green' : '',
      color: voteType.value === 'with' ? 'white' : 'green',
      height: '48px',
    }));

    const againstButtonStyle = computed(() => ({
      backgroundColor: voteType.value === 'against' ? 'red' : '',
      color: voteType.value === 'against' ? 'white' : 'red',
      height: '48px',
    }));

    const updateVoteCounts = () => {
      numberOfWithVotes.value = props.debate.votesWith.length;
      numberOfAgainstVotes.value = props.debate.votesAgainst.length;
    };

    watch(
      () => props.debate,
      () => {
        updateVoteCounts();
      },
      {immediate: true}
    );

    const fetchLoggedInUserId = async () => {
      try {
        const user = await getLoggedInUser();
        userId.value = user ? user.id : null;
      } catch (error) {
        console.error("Failed to fetch logged-in user ID:", error);
      }
    };

    const vote = async (voteTypeSelected) => {
      if (!token) {
        alert("Please log in to vote.");
        return;
      }

      try {
        const response = await Api.patch(
          `/debates/${props.debate._id}/vote`,
          {voteType: voteTypeSelected},
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        // Update the debate with actual values from the server
        props.debate.votesWith = response.data.debate.votesWith;
        props.debate.votesAgainst = response.data.debate.votesAgainst;
        updateVoteCounts();
        voteType.value = voteTypeSelected; // Set the vote type after success
      } catch (error) {
        console.error(`Failed to vote ${voteTypeSelected}:`, error);
        voteType.value = ''; // Reset vote type in case of error
      }
    };

    const addArgument = async () => {
      if (!newArgument.value.trim()) {
        alert("Argument cannot be empty.");
        return;
      }

      try {
        // Ensure userId is available before submitting
        if (!userId) {
          await fetchLoggedInUserId();
        }

        const response = await Api.post(
          `/debates/${props.debate._id}/arguments`,
          {
            content: newArgument.value,
            userId: userId.value,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        // Add the new argument to the debate's argument list
        props.debate.arguments.push(response.data);
        newArgument.value = ''; // Clear the textarea after submission
      } catch (error) {
        console.error("Failed to add argument:", error);
      }
    };

    const loadMoreArguments = () => {
      argumentsLimit.value += 5;
    };

    return {
      userId,
      newArgument,
      voteType,
      numberOfWithVotes,
      numberOfAgainstVotes,
      argumentsLimit,
      withButtonStyle,
      againstButtonStyle,
      voteWith: debounce(() => vote("with"), 300),
      voteAgainst: debounce(() => vote("against"), 300),
      addArgument,
      loadMoreArguments,
    };
  },
  async mounted() {
    await this.fetchLoggedInUserId();
  },
};
</script>

<style scoped>
.vote-button {
  cursor: pointer;
  transition: background-color 0.3s ease, color 0.1s ease;
  border-radius: 10px;
}

.vote-button:hover {
  background-color: rgba(255, 255, 255, 0.1);
}
</style>
