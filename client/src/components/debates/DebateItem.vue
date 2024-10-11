<template>
  <div>
    <!-- Header -->
    <div class="d-flex flex-row justify-content-between">
      <div v-if="status !== 'closed'">
        <h3 class="fw-bold" style="font-size: small;">{{ endTime }}</h3>
      </div>
      <i class="bi bi-three-dots-vertical"></i>
    </div>

    <div class="d-flex flex-column text-start row-gap-3">
      <!-- Title -->
      <h1 class="m-0" style="font-size: 25px; font-weight: 650">{{ topic }}</h1>

      <!-- Category Tag -->
      <div class="d-inline-block bg-success px-3 rounded text-white fw-bold"
           style="font-size: 14px; max-width: fit-content">
        <p class="m-0">{{ category }}</p>
      </div>

      <!-- Arguments List -->
      <arguments-list
        :arguments="argumentsList.slice(0, argumentsLimit)"
        :debate="id"
        :user="userId"
      />

      <!-- Load More Arguments Button -->
      <button v-if="argumentsLimit < debateObj.arguments.length" @click="loadMoreArguments">
        View more arguments
      </button>

      <!-- Add New Argument -->
      <div class="mt-4">
        <b-form @submit="addArgument">
          <b-form-textarea
            v-model="newArgument"
            placeholder="Enter your argument here"
            rows="3"
            required
          ></b-form-textarea>
          <button class="btn btn-primary mt-2 w-100" type="submit">Submit Argument</button>
        </b-form>
      </div>
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
    debateObj: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      id: '',
      topic: '',
      endTime: '',
      category: '',
      argumentsList: [],
      votesWith: [],
      votesAgainst: [],
      status: '',
    };
  }
  ,setup(props) {
    let userId = ref(null);
    const newArgument = ref('');
    const token = localStorage.getItem("token");
    const voteType = ref('');


    let numberOfWithVotes = ref(0);
    let numberOfAgainstVotes = ref(0);
    let argumentsLimit = ref(5);

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
      numberOfWithVotes.value = props.debateObj.votesWith.length;
      numberOfAgainstVotes.value = props.debateObj.votesAgainst.length;
    };

    watch(
      () => props.debateObj,
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
          `/debates/${props.debateObj._id}/vote`,
          {voteType: voteTypeSelected},
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        // Update the debate with actual values from the server
        props.debateObj.votesWith = response.data.debate.votesWith;
        props.debateObj.votesAgainst = response.data.debate.votesAgainst;
        updateVoteCounts();
        voteType.value = voteTypeSelected;
      } catch (error) {
        console.error(`Failed to vote ${voteTypeSelected}:`, error);
        voteType.value = '';
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
          `/debates/${props.debateObj._id}/arguments`,
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
        this.debateObj.arguments.push(response.data);
        newArgument.value = '';
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
  async created() {
    this.id = this.debateObj._id;
    console.log("Debate ID:", this.id);
    this.topic = this.debateObj.topic;
    this.category = this.debateObj.category;
    this.argumentsList = this.debateObj.arguments;
    this.endTime = this.debateObj.endTime;
    this.votesWith = this.debateObj.votesWith;
    this.votesAgainst = this.debateObj.votesAgainst;
    this.status = this.debateObj.status;
    this.userId = await getLoggedInUser();
  }
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
