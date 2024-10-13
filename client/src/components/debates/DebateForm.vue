<template>
  <div id="main-container">

    <h2 style="color: grey; font-size: 20px; font-weight: 550;">Post a Debate</h2>
    <form @submit.prevent="createDebate"
          class="d-flex flex-column row-gap-1 w-100 p-1 bg-white rounded-3"
          style="min-width: 200px"
    >
      <!-- Topic input -->
      <div class="subject">
        <span>Topic</span>
        <b-input type="text" id="topic" name="topic" v-model="topic" class="w-100" required placeholder="Debate Topic"/>
      </div>

      <!-- Category Selector with Placeholder -->
      <div class="subject">
        <span>Category</span>
        <b-form-select
          v-model="selectedCategory"
          :options="categoryOptions"
          required
        >
          <option disabled value="">Select Category</option>
        </b-form-select>
      </div>

      <!-- Max Participants with min 2 and max 4 -->
      <div class="d-flex flex-row column-gap-3">
        <div class="subject w-50">
          <span>Max Participants</span>
          <b-form-spinbutton
            type="number"
            id="maxParticipants"
            name="maxParticipants"
            v-model="maxParticipants"
            :min="2"
            :max="4"
            required
            placeholder="Max Participants"
          />
        </div>

        <!-- End Time in Days (min 1 day, max 7 days) -->
        <div class="subject w-50">
          <span>End Time (days)</span>
          <b-form-spinbutton
            v-model="endDays"
            :min="1"
            :max="7"
            required
            placeholder="End in days"
            label="End in Days"
          />
        </div>
      </div>
      <b-button type="submit">Create Debate</b-button>

      <!-- Success or error message -->
      <div class="d-flex w-100 justify-content-center" id="alert-box">
        <h1 v-if="message.type === 'success'" id="successful-message">{{ message.text }}</h1>
        <h1 v-if="message.type === 'error'" id="alert-message">{{ message.text }}</h1>
      </div>
    </form>
  </div>
</template>

<script>
import { Api } from '@/api/v1/Api.js';
import { getLoggedInUser } from '@/api/v1/usersApi.js';

export default {
  name: "DebateForm",
  data() {
    return {
      topic: "",
      maxParticipants: 2,
      selectedCategory: "Politics",
      categoryOptions: [
        { value: 'Politics', text: 'Politics' },
        { value: 'Technology', text: 'Technology' },
        { value: 'Sports', text: 'Sports' },
        { value: 'Health', text: 'Health' },
        { value: 'Education', text: 'Education' },
        { value: 'Social Issues', text: 'Social Issues' }
      ],
      endDays: 1,
      owner: "",
      message: {
        type: "",
        text: "",
      },
    };
  },
  methods: {
    async createDebate() {
      try {
        // Await the result from getLoggedInUser
        const user = await getLoggedInUser();

        // Calculate the end time based on the number of days selected
        const endTime = new Date();
        endTime.setDate(endTime.getDate() + this.endDays);

        const response = await Api.post("/debates", {
          topic: this.topic,
          maxParticipants: this.maxParticipants,
          category: this.selectedCategory,
          endTime: endTime.toISOString(),
          owner: user._id,
        }, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        if ([200, 201, 204].includes(response.status)) {
          this.message.type = "success";
          this.message.text = "Debate created successfully!";
        } else {
          this.message.type = "error";
          this.message.text = response.data.message || "An error occurred while creating the debate!";
        }

        // Clear the message after 3 seconds
        setTimeout(() => {
          this.message.type = "";
          this.message.text = "";
        }, 2000);
        window.location.reload();

      } catch (error) {
        console.error("Error creating debate: ", error);
        this.message.type = "error";
        this.message.text = error.response?.data?.message || "An error occurred while creating the debate!";

        // Clear the message after 3 seconds
        setTimeout(() => {
          this.message.type = "";
          this.message.text = "";
        }, 2000);
      }
    }
  }
}
</script>

<style scoped>

#main-container {
  display: flex;
  flex-direction: column;
  row-gap: 10px;
  border-width: 1px;
  border-style: solid;
  border-color:  #cdcdcd;
  border-radius: 20px;
  padding: 20px;
}

.subject {
  display: flex;
  flex-direction: column;
  row-gap: 10px;
  color: grey;
  border: 4px #cdcdcd;
  border-radius: 15px;
  text-align: start;
  margin-bottom: 10px;
  font-weight: 750;
}

#successful-message {
  color: green;
  font-size: 14px;
  font-weight: 550;
  position: absolute;
}

#alert-box {
  position: relative;
  height: 7px;
}

#alert-message {
  color: red;
  font-size: 14px;
  font-weight: 550;
  position: absolute;
}

button {
  background-color: #007769;
  width: 100%;
  font-weight: 750;
  border-radius: 12px;
}

button:hover {
  background-color: #01675b;
}
</style>
