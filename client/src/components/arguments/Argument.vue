<template>
  <div class="d-flex flex-column px-3 py-3 rounded-4 shadow-sm">
    <div class="d-flex justify-content-between align-items-center">
      <div class="d-flex align-items-center gap-2">
        <img :src="owner.avatar || '../../../assets/avatars/avatar.png'"
             :alt="owner.username"
             class="rounded-circle"
             style="width: 48px;">
        <h5 class="fw-bold mb-0">{{ owner.username }}</h5>
      </div>
      <button v-if="isOwner" @click="deleteArgument" class="btn btn-outline-primary">Delete</button>
    </div>
    <p class="p-2 fs-5">{{ content }}</p>
    <div class="d-flex align-items-center gap-2">
      <i class="bi bi-chat-fill text-muted"></i>
      <span class="fw-bold" style="font-size: 14px">{{ commentsWithUserDetails.length }}</span>
      <button @click="showCommentsPopup = true" class="btn btn-link p-0" style="font-size: 14px">View/Add Comments</button>
    </div>

    <div v-if="showCommentsPopup" class="comments-popup">
      <div class="comments-popup-content">
        <h3 class="mb-4">Comments</h3>
        <div class="comments-list">
          <ul class="list-unstyled">
            <li v-for="comment in commentsWithUserDetails" :key="comment._id" class="mb-3 p-2 border-bottom">
              <div class="d-flex gap-2 w-100 p-3 border-bottom border-light">
                <img :src="comment.userDetails?.profileImg || '../../../public/logo/deebate-logo-dark.png'"
                     :alt="comment.userDetails?.username"
                     class="rounded-5"
                     style="width: 40px; height: 40px;">
                <div>
                  <h6 class="m-0 fw-bold">{{ comment.userDetails?.firstName }} {{ comment.userDetails?.lastName }}</h6>
                  <small class="text-muted">@{{ comment.userDetails?.username }}</small>
                </div>
              </div>
              <p class="mb-0 mt-2">{{ comment.content }}</p>
            </li>
          </ul>
        </div>

        <div class="mt-4">
          <h5>Add a comment</h5>
          <textarea v-model="newComment" placeholder="Type your comment here" class="form-control mb-2"></textarea>
          <button @click="submitComment" class="btn btn-primary">Submit Comment</button>
        </div>

        <button @click="showCommentsPopup = false" class="btn btn-outline-secondary mt-3">Close</button>
      </div>
    </div>
  </div>
</template>

<script>
import { Api } from '@/api/v1/Api.js'
import { getLoggedInUser } from '@/api/v1/usersApi.js'

export default {
  name: 'Argument',
  props: {
    argument: { type: Object, required: true },
    debate: { type: String, required: true }
  },
  data() {
    return {
      content: '',
      owner: { _id: '', username: '', avatar: '' },
      commentsWithUserDetails: [],
      newComment: '',
      isOwner: false,
      showCommentsPopup: false
    }
  },
  async created() {
    await this.fetchArgument()
    await this.fetchOwner()
    await this.checkIfOwner()
    await this.fetchCommentUserDetails()
  },
  methods: {
    async checkIfOwner() {
      try {
        const user = await getLoggedInUser()
        this.isOwner = user && user._id === this.owner._id
      } catch (error) {
        console.error('Failed to check ownership:', error)
      }
    },
    async fetchArgument() {
      try {
        const { data } = await Api.get(`/debates/${this.debate}/arguments/${this.argument}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        })
        this.content = data.content
        this.owner._id = data.owner
        this.commentsWithUserDetails = data.comments
      } catch (error) {
        console.error('Failed to fetch argument:', error)
      }
    },
    async fetchOwner() {
      try {
        const { data } = await Api.get(`/users/${this.owner._id}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        })
        this.owner = { ...this.owner, ...data.user }
      } catch (error) {
        console.error('Failed to fetch owner:', error)
      }
    },
    async deleteArgument() {
      try {
        const response = await Api.delete(`/debates/${this.debate}/arguments/${this.argument}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        })
        if (response.status >= 200 && response.status < 300) {
          this.$emit('argument-deleted', this.argument)
          window.location.reload()
        }
      } catch (error) {
        console.error('Failed to delete argument:', error)
      }
    },
    async fetchCommentUserDetails() {
      this.commentsWithUserDetails = await Promise.all(
        this.commentsWithUserDetails.map(async (comment) => {
          try {
            const { data } = await Api.get(`/users/${comment.owner}`, {
              headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            })
            return { ...comment, userDetails: data.user }
          } catch (error) {
            console.error('Failed to fetch comment owner details:', error)
            return comment
          }
        })
      )
    },
    async submitComment() {
      if (!this.newComment.trim()) {
        alert('Please enter a comment')
        return
      }
      try {
        const { data } = await Api.post(`/debates/${this.debate}/arguments/${this.argument}/comments`,
          { content: this.newComment },
          { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
        )
        const currentUser = await getLoggedInUser()
        this.commentsWithUserDetails.push({ ...data, userDetails: currentUser })
        this.newComment = ''
      } catch (error) {
        console.error('Error submitting comment:', error)
      }
    }
  }
}
</script>

<style scoped>
.comments-popup {
  position: fixed;
  inset: 0;
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
  max-height: 80vh;
  display: flex;
  flex-direction: column;
}

.comments-list {
  flex-grow: 1;
  overflow-y: auto;
  margin-bottom: 20px;
}

textarea {
  width: 100%;
  height: 100px;
  margin-bottom: 10px;
}
</style>
