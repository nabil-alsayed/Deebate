<template>
  <div class="d-flex flex-column row-gap-2">
    <!-- Header -->
    <div class="d-flex flex-row justify-content-between align-items-center" style="height: fit-content;font-family: 'Inter', sans-serif">
      <div v-if="!isDebateClosed" class="d-flex flex-row column-gap-1 justify-content-center">
        <!-- Show the formatted end time if the debate is not closed -->
        <h3 class="fw-medium m-0" style="font-size: small;">Ends at</h3>
        <h3 class="fw-bold m-0" style="font-size: small; color: #a83737">{{ formattedEndTime }}</h3>
      </div>
      <!-- Category Tag -->
      <div v-else class="d-flex flex-row column-gap-1 bg-black px-2 rounded text-white fw-bold"
           style="font-size: 14px; max-width: fit-content; height: fit-content">
        {{status}}
        <p class="m-0">
          <i class="bi bi-door-closed"></i>
        </p>
      </div>
      <i v-if="isOwner" @click="deleteDebate" class="bi bi-trash" style="font-size: 15px; color: #a83737; cursor: pointer" />
    </div>

    <div class="d-flex flex-column text-start row-gap-2">
      <!-- Title -->
      <h1 class="m-0" style="font-size: 25px; font-weight: 650">{{ topic }}</h1>

      <!-- Category Tag -->
      <div class="d-inline-block bg-success px-2 rounded text-white fw-bold"
           style="font-size: 14px; max-width: fit-content">
        <p class="m-0">{{ category }}</p>
      </div>

      <!-- Arguments List -->
      <arguments-list
        :arguments="argumentsList.slice(0, argumentsLimit)"
        :debate="debateObj"
      />

      <analysis v-if="hasAnalysis" :debate="debateObj" />

      <!-- Load More Arguments Button -->
      <button v-if="argumentsLimit < debateObj.arguments.length"
              class="btn w-100"
              style="color: #0f5132"
              @click="loadMoreArguments">
        View more arguments
      </button>

      <!-- Add New Argument -->
      <div v-if="status !== 'closed'" class="d-flex flex-column row-gap-2">
        <b-form @submit.prevent="addArgument" class="d-flex flex-column row-gap-2">
          <b-form-textarea
            v-model="newArgument"
            placeholder="Enter your argument here"
            rows="3"
            required
          ></b-form-textarea>

          <div>
            <!-- Disable if user hasn't voted or isn't a participant -->
            <button :disabled="!hasVoted && !isParticipant" class="btn btn-primary w-100" type="submit">
              Kick Your Argument
            </button>
          </div>

          <!-- Voting Buttons -->
          <div v-if="!hasVoted && !isParticipant" class="d-flex fw-bold rounded text-white justify-content-center align-items-center">
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

          <!-- Withdraw vote button -->
          <div v-if="hasVoted && !isParticipant">
            <button @click="cancelVote" class="btn cancel-button w-100" type="button">Withdraw your vote</button>
          </div>
        </b-form>
      </div>
    </div>

    <!-- Alert for success/error messages -->
    <div v-if="alertShown" :class="['alert-box', message.type]">
      {{ message.text }}
    </div>
  </div>
</template>

<script>
import { ref, computed, watch } from 'vue'
import ArgumentsList from '@/components/arguments/ArgumentsList.vue'
import { Api } from '@/api/v1/Api.js'
import { getLoggedInUser } from '@/api/v1/usersApi.js'
import debounce from 'lodash.debounce'
import Argument from "@/components/arguments/Argument.vue";
import Analysis from "@/components/arguments/Analysis.vue";

export default {
  name: 'DebateItem',
  components: { Analysis, Argument, ArgumentsList },
  props: {
    debateObj: {
      type: Object,
      required: true
    }
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
      analysis: '',
      winnerByAI: '',
      winnerByAudience: '',
      chatGptUser: null
    }
  },
  setup(props) {
    const user = ref(null)
    const newArgument = ref('')
    const token = localStorage.getItem('token')
    const hasVoted = ref(false)
    const userSide = ref('')
    const message = ref({ type: '', text: '' })
    const alertShown = ref(false)
    const isParticipant = ref(false)
    const isOwner = ref(false)
    const chatgptResponse = ref('')
    const debateAnalysis = ref('')
    const showAnalysis = ref(false)

    const hasAnalysis = computed(() => {
      return props.debateObj && props.debateObj.analysis && props.debateObj.analysis.trim() !== ''
    })



    const numberOfWithVotes = computed(() => props.debateObj.votesWith.length)
    const numberOfAgainstVotes = computed(() => props.debateObj.votesAgainst.length)
    let argumentsLimit = ref(2)

    const withButtonStyle = computed(() => ({
      backgroundColor: userSide.value === 'with' ? '#16B771' : '',
      color: userSide.value === 'with' ? 'white' : '#16B771',
      height: '48px',
      cursor: hasVoted.value ? 'default' : 'pointer'
    }))

    const againstButtonStyle = computed(() => ({
      backgroundColor: userSide.value === 'against' ? 'red' : '',
      color: userSide.value === 'against' ? 'white' : 'red',
      height: '48px',
      cursor: hasVoted.value ? 'default' : 'pointer'
    }))

    // Check if the debate has ended
    const isDebateClosed = computed(() => {
      return new Date(props.debateObj.endTime) < new Date()
    })

    // Format the end time as date and time
    const formattedEndTime = computed(() => {
      const endDate = new Date(props.debateObj.endTime)
      return endDate.toDateString()
    })

    // Update the vote counts
    const updateVoteCounts = () => {
      numberOfWithVotes.value = props.debateObj.votesWith.length
      numberOfAgainstVotes.value = props.debateObj.votesAgainst.length
    }

    // Show alert message
    const showAlert = () => {
      // Show the alert
      alertShown.value = true
      // Hide alert after 1.5 seconds
      setTimeout(() => {
        alertShown.value = false
        // Reload the page after successful update
        if (message.value.type === 'success') {
          window.location.reload()
        }
      }, 1000)
    }

    // Watch for changes in the debate object
    watch(
      () => props.debateObj,
      () => {
        updateVoteCounts()
      },
      { immediate: true }
    )

    // Fetch the logged-in user ID
    const fetchLoggedInUserId = async () => {
      try {
        const user = await getLoggedInUser()
        user.value = user ? user.id : null
      } catch (error) {
        console.error('Failed to fetch logged-in user ID:', error)
      }
    }

    // Vote for a debate
    const vote = async (voteTypeSelected) => {
      if (!token) {
        alert('Please log in to vote.')
        return
      }

      const isCancellingVote = userSide.value === voteTypeSelected

      try {
        const response = await Api.patch(
          `/debates/${props.debateObj._id}/vote`,
          {
            voteType: isCancellingVote ? 'remove' : voteTypeSelected,
            userId: user.value._id
          },
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        )

        props.debateObj.votesWith = response.data.debate.votesWith
        props.debateObj.votesAgainst = response.data.debate.votesAgainst

        if (isCancellingVote) {
          userSide.value = null
          hasVoted.value = false
          localStorage.removeItem(`vote_${props.debateObj._id}`)
        } else {
          userSide.value = voteTypeSelected
          hasVoted.value = true
          localStorage.setItem(`vote_${props.debateObj._id}`, voteTypeSelected)
        }
      } catch (error) {
        console.error(`Failed to vote ${voteTypeSelected}:`, error)
        userSide.value = ''
      }
    }

    const cancelVote = () => {
      vote(userSide.value)
    }

    const getUserSide = () => {
      const userId = user.value._id

      // Check if user is in the votesWith array
      if (props.debateObj.votesWith.includes(userId)) {
        userSide.value = 'with'
        hasVoted.value = true
        return 'with'
      }

      // Check if user is in the votesAgainst array
      if (props.debateObj.votesAgainst.includes(userId)) {
        userSide.value = 'against'
        hasVoted.value = true
        return 'against'
      }

      // If user has not voted yet (should not happen since user is a participant)
      userSide.value = ''
      return ''
    }

    const addArgument = async () => {
      if (!newArgument.value.trim()) {
        alert('Argument cannot be empty.')
        return
      }

      if (!hasVoted.value && !isParticipant.value) {
        alert('You need to vote before submitting an argument.')
        return
      }

      const side = getUserSide()

      try {
        if (!user.value) {
          await fetchLoggedInUserId()
        }

        const response = await Api.post(
          `/debates/${props.debateObj._id}/arguments`,
          {
            content: newArgument.value,
            userId: user.value._id,
            side: side
          },
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        )

        props.debateObj.arguments.push(response.data)
        newArgument.value = ''
        message.value = { type: 'success', text: 'Argument added successfully!' }
        showAlert()
      } catch (error) {
        const errorMsg = error.response?.data?.message || 'Failed to add argument.'
        message.value = { type: 'error', text: errorMsg }
        showAlert()
      }
    }

    const checkIfUserIsParticipant = () => {
      if (user.value) {
        const participants = props.debateObj.participants
        isParticipant.value = participants.some((participant) => participant === user.value._id)
      }
    }

    const checkIfUserIsOwner = () => {
      if (user.value) {
        const owner = props.debateObj.owner
        isOwner.value = owner._id === user.value._id
      }
    }

    const loadMoreArguments = () => {
      argumentsLimit.value += 5
    }

    const storeVoteType = () => {
      const vote = localStorage.getItem(`vote_${props.debateObj._id}`)
      getUserSide()
      if (!vote) {
        localStorage.setItem(`vote_${props.debateObj._id}`, userSide.value)
      }
    }

    // Make use of HATEOAS links to fullfill the requirement
    const deleteDebate = async () => {
      if (!props.debateObj.links || !props.debateObj.links.delete) {
        console.error('Delete link not available')
        message.value = { type: 'error', text: 'Unable to delete debate. Delete link not available.' }
        showAlert()
        return
      }

      try {
        await Api.delete(props.debateObj.links.delete, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        })
        message.value = { type: 'success', text: 'Debate deleted successfully!' }
        showAlert()
      } catch (error) {
        const errorMsg = error.response?.data?.message || 'Failed to delete debate.'
        message.value = { type: 'error', text: errorMsg }
        showAlert()
      }
    }

    const getAnalysis = () => {
      return props.debateObj.analysis
    }

    const checkIfAnalysisIsAvailable = () => {
      if(!getAnalysis().isEmpty()){
        debateAnalysis.value = props.debateObj.analysis
      }
    }

    return {
      user,
      hasVoted,
      userSide,
      newArgument,
      isParticipant,
      isOwner,
      isDebateClosed,
      numberOfWithVotes,
      numberOfAgainstVotes,
      argumentsLimit,
      withButtonStyle,
      againstButtonStyle,
      voteWith: debounce(() => vote('with'), 300),
      voteAgainst: debounce(() => vote('against'), 300),
      checkIfUserIsParticipant,
      checkIfUserIsOwner,
      cancelVote,
      addArgument,
      loadMoreArguments,
      getUserSide,
      storeVoteType,
      formattedEndTime,
      message,
      alertShown,
      deleteDebate,
      chatgptResponse,
      showAnalysis,
      checkIfAnalysisIsAvailable,
      getAnalysis,
      hasAnalysis,
    }
  },
  async created() {
    this.id = this.debateObj._id
    this.topic = this.debateObj.topic
    this.category = this.debateObj.category
    this.argumentsList = this.debateObj.arguments
    this.endTime = this.debateObj.endTime
    this.votesWith = this.debateObj.votesWith
    this.votesAgainst = this.debateObj.votesAgainst
    this.status = this.debateObj.status
    this.user = await getLoggedInUser()
    this.userSide = this.getUserSide()

    // Check if the user is an owner or/and participant
    this.checkIfUserIsOwner()
    this.checkIfUserIsParticipant()
    // this.checkIfAnalysisIsAvailable()
  }
}
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

.btn {
  color: white;
  font-weight: 650;
  border: none;
}

.btn-primary {
  background: #017769;
}

.cancel-button {
  background: #b54c4c;
}

.alert-box {
  position: fixed;
  top: 0;
  left: 50%;
  transform: translateX(-50%);
  padding: 10px;
  border-radius: 5px;
  font-weight: bold;
  z-index: 1000;
  transition: opacity 0.3s ease, top 0.3s ease;
}

.alert-box.success {
  background-color: #d4edda;
  color: #398549;
}

.alert-box.error {
  background-color: #f8d7da;
  color: #a53d45;
}

</style>
