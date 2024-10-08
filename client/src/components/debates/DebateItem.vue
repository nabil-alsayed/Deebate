<template>
  <div class="d-flex flex-column row-gap-1">
    <!-- Header -->
    <div class="d-flex flex-row justify-content-between">
      <div v-if="debate.status !== 'closed'">
        <h3 class="fw-bold" style="font-size: small;">{{ debate.endTime }}</h3>
      </div>
      <i class="bi bi-three-dots-vertical"></i>
    </div>

    <div class="text-start">
      <!-- Title -->
      <h1 class="fs-5 fw-bold">{{ debate.topic }}</h1>

      <!-- Category Tag -->
      <div class="d-inline-block bg-success px-3 rounded text-white fw-bold" style="font-size: 14px;">
        <p class="m-0">{{ debate.category }}</p>
      </div>

      <!-- Arguments -->
      <arguments-list :arguments="debate.arguments" :debateId="debate._id"  :userId="getLoggedInUser"/>
    </div>
  </div>
</template>

<script>
import ArgumentsList from "@/components/arguments/ArgumentsList.vue";
import { Api } from "@/api/v1/Api.js";
import { getLoggedInUser } from "@/api/v1/usersApi.js";

export default {
  name: "DebateItem",
  components: { ArgumentsList },
  props: {
    debate: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      userId: null,
      creatorName: "",
      debatorName: "",
      token: localStorage.getItem("token"),
    };
  },
  async mounted() {
    this.userId = await this.fetchLoggedInUserId();
    this.getCreator();
    this.getDebator();
  },
  updated() {
    this.getCreator();
    this.getDebator();
  },
  methods: {
    getLoggedInUser,
    methods: {
      async fetchLoggedInUserId() {
        try {
          const user = await getLoggedInUser();
          return user ? user.id : null;
        } catch (error) {
          console.error("Failed to fetch logged-in user ID:", error);
          return null;
        }
      },
      getCreator() {
        Api.get(`/users/${this.creator}`,{
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
          .then((response) => {
            this.creatorName = response.data.username;
          })
          .catch((error) => {
            console.error("Error fetching creator:", error);
            this.creatorName = "Unknown";
          });
      },
      getDebator() {
        const debatorId = this.participants[0];
        if (debatorId) {
          Api.get(`/users/${debatorId}`,{
            headers: {
              Authorization: `Bearer ${token}`,
            },
          })
            .then((response) => {
              this.debatorName = response.data.user.username;
            })
            .catch((error) => {
              console.error("Error fetching debator:", error);
              this.debatorName = "Unknown";
            });
        }
      },
    },
  },
};
</script>
