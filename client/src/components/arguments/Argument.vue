<template>
  <div class="argument-item p-3 mb-2 rounded shadow-sm">
    <!-- Display the argument content -->
    <div class="argument-item p-3 mb-2 rounded shadow-sm">
      <h5>{{ this.content }}</h5>
    </div>

    <p><strong>Owner:</strong> {{ this.owner }}</p>
    <p v-if="this.comments && this.comments.length">
      <strong>Comments:</strong> {{ this.comments.length }}
    </p>
    <p><strong>Votes:</strong> {{ this.votes || 0 }}</p>
  </div>
</template>

<script>
import {Api} from "@/api/v1/Api.js";

export default {
  name: "ArgumentItem",
  data() {
    return {
      argumentObj: null,
      content: '',
      owner: '',
      comments: [],
      votes: [],
    };
  },
  props: {
    argument: {
      type: Object,
      required: true,
    },
    debateId: {
      type: String,
      required: true,
    },
  },
  async mounted() {
    this.argumentObj = await this.fetchArgument();
    this.content = this.argumentObj.content;
    this.owner = this.argumentObj.owner;
    this.comments = this.argumentObj.comments;
    this.votes = this.argumentObj.votes;
  },
  methods: {
    async fetchArgument() {
      try {
        const response = await Api.get(`/debates/${this.debateId}/arguments/${this.argument}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          });
        return response.data;
      } catch (error) {
        console.error("Failed to fetch argument:", error);
        return null;
      }
    }
  }
};
</script>

<style scoped>
.argument-item {
  background-color: #f9f9f9;
  border-left: 4px solid #16b771;
}
</style>
