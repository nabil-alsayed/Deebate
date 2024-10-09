<template>
  <div class="d-flex flex-column px-3 py-3 rounded-4 shadow-sm">
    <!-- Display the argument content -->
    <div class="d-flex flex-row">
      <div class="d-flex flex-row align-items-center column-gap-1">
        <img :src="owner.avatar || '../../../assets/avatars/avatar.png'"
             alt="User Avatar"
             class="rounded-circle"
             style="width: 48px;"
        >
        <h5 class="fw-bold">{{ owner.username }}</h5>
      </div>
      <div v-if="isOwner" class="d-flex flex-row align-items-center ms-auto">
        <button @click="deleteArgument" class="btn btn-outline-primary">Delete</button>
      </div>
    </div>
    <div class="p-2 fs-5">
      <h6>{{ content }}</h6>
    </div>
    <div class="d-flex flex-row column-gap-2 align-items-center">
      <i class="bi bi-chat-fill text-muted"></i>
      <p class="fw-bold mb-0" style="font-size: 14px">{{ comments.length }}</p>
    </div>
  </div>
</template>

<script>
import { Api } from "@/api/v1/Api.js";
import { getLoggedInUser } from "@/api/v1/usersApi.js";

export default {
  name: "Argument",
  data() {
    return {
      content: '',
      owner: {
        _id: '',
        username: '',
        avatar: '',
      },
      comments: [],
      votes: [],
      isOwner: false,
      debateId: this.debate,
    };
  },
  props: {
    argument: {
      type: Object,
      required: true,
    },
    debate: {
      type: String,
      required: true,
    },
  },
  async created() {
    await this.fetchArgument();
    await this.fetchOwner();
    await this.checkIfOwner();
  },
  methods: {
    async checkIfOwner() {
      try {
        const user = await getLoggedInUser();
        if (user) {
          this.isOwner = user._id === this.owner._id;
        }
      } catch (error) {
        console.error("Failed to check ownership:", error);
      }
    },
    async fetchArgument() {
      try {
        const response = await Api.get(`/debates/${this.debateId}/arguments/${this.argument}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        this.content = response.data.content;
        this.owner._id = response.data.owner;
        this.comments = response.data.comments;
        this.votes = response.data.votes;
      } catch (error) {
        console.error("Failed to fetch argument:", error);
      }
    },
    async fetchOwner() {
      try {
        const response = await Api.get(`/users/${this.owner._id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        this.owner.username = response.data.user.username;
        this.owner.avatar = response.data.user.avatar;
      } catch (error) {
        console.error("Failed to fetch owner:", error);
      }
    },
    async fetchDebate() {
      this.debate = this.debateId;
    },
    async deleteArgument() {
      try {
        console.log("Deleting argument:", this.argument + " in debate " + this.debateId);
        await Api.delete(`/debates/${this.debate}/arguments/${this.argument}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        this.$emit("argument-deleted", this.argument);
      } catch (error) {
        console.error("Failed to delete argument:", error);
      }
    },
  },
};
</script>

<style scoped>
.argument-item {
  background-color: #f9f9f9;
  border-left: 4px solid #16b771;
}
</style>
