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

    <!-- Comments Section -->
    <div class="d-flex flex-row column-gap-2 align-items-center">
      <i class="bi bi-chat-fill text-muted"></i>
      <p class="fw-bold mb-0" style="font-size: 14px">{{ comments.length }}</p>
      <button @click="showCommentsPopup = true" class="btn btn-link p-0" style="font-size: 14px">View/Add Comments</button>
    </div>

    <!-- Comments Popup -->
    <div v-if="showCommentsPopup" class="comments-popup">
      <div class="comments-popup-content">
        <h3>Comments</h3>

        <!-- List all comments -->
        <ul>
          <li v-for="comment in comments" :key="comment._id">
            <p><strong>{{ comment.owner.username }}:</strong> {{ comment.content }}</p>
          </li>
        </ul>

        <!-- Add New Comment -->
        <textarea v-model="newComment" placeholder="Type your comment here"></textarea>
        <button @click="submitComment" class="btn btn-primary mt-2">Submit Comment</button>

        <!-- Close button -->
        <button @click="showCommentsPopup = false" class="btn btn-outline-secondary mt-2">Close</button>
      </div>
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
      newComment: '',
      votes: [],
      isOwner: false,
      debateId: this.debate,
      showCommentsPopup: false,  // Control the visibility of the comments popup
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
    async deleteArgument() {
      try {
        console.log("Deleting argument:", this.argument + " in debate " + this.debateId);
        const response = await Api.delete(`/debates/${this.debate}/arguments/${this.argument}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        if (["200", "204", "201"].includes(response.status.toString())) {
          this.$emit("argument-deleted", this.argument);
          window.location.reload();
        }
        return response;
      } catch (error) {
        console.error("Failed to delete argument:", error);
      }
    },

    // Submit a new comment
    async submitComment() {
      if (this.newComment.trim() === '') {
        alert('Please enter a comment');
        return;
      }

      try {
        const response = await Api.post(`/debates/${this.debateId}/arguments/${this.argument}/comments`, {
          content: this.newComment,
        }, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        this.comments.push(response.data); // Add the new comment to the list
        this.newComment = ''; // Clear the input field
      } catch (error) {
        console.error('Error submitting comment:', error);
      }
    },
  },
};
</script>

<style scoped>
.argument-item {
  background-color: #f9f9f9;
  border-left: 6px solid #16b771;
}

.comments-popup {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
}

.comments-popup-content {
  background: white;
  padding: 20px;
  border-radius: 8px;
  width: 500px;
  max-width: 90%;
}

textarea {
  width: 100%;
  height: 100px;
  margin-bottom: 10px;
}

.close-btn {
  background-color: red;
  color: white;
  border: none;
  padding: 10px;
  cursor: pointer;
}
</style>
