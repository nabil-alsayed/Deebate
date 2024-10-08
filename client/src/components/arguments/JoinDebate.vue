<script>
import {Api} from "@/api/v1/Api.js";

export default {
  name: "JoinDebate",
  data() {
    return {
      opponentUsername: null,
      user: null,
    }
  },
  props: {
    opponentId: {
      type: String,
    },
  },
  mounted() {
    this.setOpponent();
  },
  methods: {
    joinDebate() {
      const token = localStorage.getItem("token");
      try {
        if (!token) {
          throw new Error("No token found");
        }
        const userId = localStorage.getItem("userId");
        if (!userId) {
          throw new Error("No user ID found");
        }
        const debateId = this.$route.params.id;
        if (!debateId) {
          throw new Error("No debate ID found");
        }
        const data = {
          debateId,
          userId,
          opponentId: this.opponentId,
        };
        Api.post("/debates/join", data, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
      } catch (error) {
        console.error("Failed to join debate:", error);
      }
    },
    async fetchUsername(id) {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No token found");
      }
      try {
        const user = await Api.get(`/users/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        return user.data.username;
      } catch (error) {
        console.error("Failed to fetch user:", error);
      }
    },
    setOpponent() {
      if (this.opponentId) {
        this.fetchUsername(this.opponentId)
          .then((username) => {
            this.opponentUsername = username;
          })
          .catch((error) => {
            console.error("Failed to fetch opponent:", error);
          });
      }
    },
  }
}
</script>

<template>
  <div class="w-100 border border-dashed border-1">
    <button v-if="opponentId" @click="joinDebate" class="btn btn-primary">Press to debate against @{{opponentUsername}}</button>
    <button v-else @click="joinDebate" class="btn btn-primary">Press to join debate</button>
  </div>
</template>

<style scoped>

</style>
