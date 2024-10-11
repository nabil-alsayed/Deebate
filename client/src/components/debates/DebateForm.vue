<template>
  <div class="d-flex flex-column row-gap-3">
    <h2 style="color: grey; font-size: 20px; font-weight: 550;">Post a Debate</h2>
    <form @submit.prevent="createDebate"
          class="d-flex flex-column row-gap-1 w-100 p-1 bg-white rounded-3"
          style="min-width: 200px"
    >
      <div class="subject">
        <b-input type="text" id="topic" name="topic" v-model="topic" class="w-100" required />
      </div>
      <div class="subject">
        <b-form-spinbutton type="number" id="maxParticipants" name="maxParticipants" v-model="maxParticipants" required />
      </div>
      <b-button type="submit">Create Debate</b-button>
    </form>
  </div>
</template>

<script>
export default {
  name: "DebateForm",
  data() {
    return {
      topic: "",
      maxParticipants: 0,
      description: "",
    };
  },
  methods: {
    createDebate() {
      // Send a POST request to the server with the form data
    },
  },
}
</script>

<style scoped>

.subject {
  border: 4px #cdcdcd;
  border-radius: 15px;
  text-align: start;
}

</style>
