<template>
  <div class="profile-info d-flex flex-row column-gap-3 align-items-center">
    <div style="border-radius: 15px;">
      <img :src="profileImg"
           alt="Profile Image"
           class="rounded-circle"
           width="130"
      />
    </div>
    <div>
      <div class="d-flex flex-row column-gap-2 align-items-center">
        <h2 class="m-0">{{ firstname }} {{ lastname }}</h2>
        <div v-if="isSameUser" class="edit-button" @click="editProfile">
          <i class="bi bi-pencil-fill" style="font-size: 15px"/>
        </div>
      </div>
      <p class="fw-semibold m-0" style="color: #a8a8a8">@{{ username }}</p>
    </div>
  </div>
</template>

<script>
import { ref } from "vue";
import { Api } from "@/api/v1/Api.js";
import {useRoute} from "vue-router";
import defaultAvatar from "@/assets/avatars/user-avatar.svg";
import router from "@/router.js";

export default {
  name: "ProfileInfo",
  setup() {
    const user = ref(null);
    const username = ref("");
    const firstname = ref("");
    const lastname = ref("");
    const profileImg = ref("");
    const token = localStorage.getItem("token");
    const route = useRoute();
    const isSameUser = ref(false);
    const userId = route.params.userId;


    const getUser = async () => {
      try {
        const response = await Api.get(`/users/${userId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        // Set the user data
        user.value = response.data.user;

        // If no profile image, use default avatar
        profileImg.value = user.value.profileImg || defaultAvatar;

        // Set user information
        if (user.value) {
          username.value = user.value.username;
          firstname.value = user.value.firstName;
          lastname.value = user.value.lastName;
        }
      } catch (error) {
        console.error("Failed to fetch user:", error);
      }
    };

    const editProfile = () => {
      // Redirect to edit profile page
      router.push({ name: "profile" });
    }

    const checkProfileOwner = () => {
      const loggedInUser = JSON.parse(localStorage.getItem("user"));
      isSameUser.value = loggedInUser._id === userId;
    }

    return {
      user,
      getUser,
      username,
      firstname,
      lastname,
      profileImg,
      editProfile,
      isSameUser,
      checkProfileOwner
    };
  },
  created() {
    this.getUser();
    this.checkProfileOwner();
  },
};
</script>

<style>
.edit-button {
  display: flex;
  font-size: 15px;
  color: #000000;
  cursor: pointer;
  width: 40px;
  height: 40px;
  border-radius: 100%;
  justify-content: center;
  align-items: center;
}

.edit-button:hover {
  background-color: #dadada;
}
</style>
