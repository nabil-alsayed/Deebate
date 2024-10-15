<template>
  <div class="edit-profile d-flex flex-column row-gap-4">
    <h2 class="profile-title">Edit Profile</h2>

    <div class="d-flex flex-column row-gap-4">
      <!-- User's First Name and Username -->
      <div class="d-flex flex-row column-gap-2 justify-content-start align-items-center">
        <img :src="this.profileImage"
             alt="profile image"
             style="height: 70px; width: 70px; border-radius: 15px;"
        />
        <div>
          <h2 class="user-name">{{ user.firstName || 'User' }}</h2>
          <p class="username">@{{ user.username }}</p>
        </div>
      </div>

      <!-- Form to edit profile -->
      <form class="d-flex flex-column row-gap-2" @submit="toggleEditMode">
        <div class="field">
          <label>First Name</label>
          <input type="text" v-model="editedUser.firstName" :disabled="!editMode" required />
        </div>
        <div class="field">
          <label>Last Name</label>
          <input type="text" v-model="editedUser.lastName" :disabled="!editMode" required />
        </div>
        <div class="field">
          <label>Username</label>
          <input type="text" v-model="editedUser.username" :disabled="!editMode" required />
        </div>
        <div class="field">
          <label>Email</label>
          <input type="email" v-model="editedUser.emailAddress" :disabled="!editMode" required />
        </div>
        <div class="field password-field">
          <label>Password</label>
          <input
            type="password"
            v-model="editedUser.password"
            :disabled="!editMode"
            :placeholder="passwordPlaceholder"
          />
        </div>
        <div class="button-group">
          <button
            v-if="editMode"
            type="button"
            @click="toggleEditMode"
            :disabled="!hasChanges || !isFormValid"
            class="save-button d-flex flex-grow-1 justify-content-center"
          >
            Save
          </button>
          <button
            v-else
            type="button"
            @click="toggleEditMode"
            :disabled="isSaving"
            class="save-button d-flex flex-grow-1 justify-content-center"
          >
            Edit
          </button>
          <button
            v-if="editMode"
            type="button"
            @click="cancelEdit"
            class="cancel-button"
            :disabled="isSaving"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
    <!-- Alert for success/error messages -->
    <div v-if="alertShown" :class="['alert-box', message.type]">
      {{ message.text }}
    </div>
  </div>
</template>

<script>
import { Api } from '@/api/v1/Api.js';
import defaultAvatar from '@/assets/avatars/user-avatar.svg';

export default {
  data() {
    return {
      user: { // This holds the current user's values
        emailAddress: '',
        username: '',
        password: '',
        firstName: '',
        lastName: '',
        profileImage: defaultAvatar,
      },
      editedUser: {}, // This holds the edited user's values
      isSaving: false, // State to disable the button while saving
      token: localStorage.getItem('token'), // Authentication token
      message: {
        type: '', // success or error
        text: '', // Message text
      },
      editMode: false, // State to track if the user is in edit mode
      alertShown: false, // State to track if the alert is displayed
      passwordPlaceholder: '********', // Placeholder for password field
    };
  },
  created() {
    // Load user data from localStorage when the component is mounted
    this.loadUser();
  },
  computed: {
    // To check if there are changes between the current user data and the edited user data
    hasChanges() {
      return (
        this.user.firstName !== this.editedUser.firstName ||
        this.user.lastName !== this.editedUser.lastName ||
        this.user.username !== this.editedUser.username ||
        this.user.emailAddress !== this.editedUser.emailAddress ||
        (this.editedUser.password && this.editedUser.password !== '')
      );
    },
    // Email format validation
    isEmailValid() {
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return emailPattern.test(this.editedUser.emailAddress);
    },
    // Check if all required fields are filled
    isFormValid() {
      return (
        this.editedUser.firstName &&
        this.editedUser.lastName &&
        this.editedUser.username &&
        this.isEmailValid
      );
    },
  },
  methods: {
    // Load the user from localStorage
    loadUser() {
      const localUser = JSON.parse(localStorage.getItem('user'));
      if (localUser) {
        this.user.emailAddress = localUser.emailAddress;
        this.user.username = localUser.username;
        this.user.firstName = localUser.firstName;
        this.user.lastName = localUser.lastName;
        this.profileImage = localUser.profileImg || defaultAvatar; // Ensure the profile image is loaded
        this.editedUser = { ...this.user, password: '' }; // Initialize with empty password
      }
    },
    // Toggle between edit and save mode
    toggleEditMode() {
      if (this.editMode) {
        // If we're in edit mode, save the profile
        this.saveProfile();
      } else {
        // Enable the inputs and switch to edit mode
        this.editMode = true;
      }
    },
    showAlert() {
      // Show the alert
      this.alertShown = true;
      // Hide alert after 1.5 seconds
      setTimeout(() => {
        this.alertShown = false;
        // Reload the page after successful update
        if(this.message.type === 'success'){
          window.location.reload();
        }
      } , 1500);
    },
    // Cancel editing and restore the original user data
    cancelEdit() {
      this.editedUser = { ...this.user }; // Restore original data
      this.editMode = false; // Exit edit mode
      this.message.text = ''; // Clear any message
    },
    async saveProfile() {
      this.isSaving = true;
      this.message.text = ''; // Clear previous messages

      try {
        const localUser = JSON.parse(localStorage.getItem('user'));
        const config = {
          headers: {
            Authorization: `Bearer ${this.token}`,
          },
        };

        // create a shallow copy of editedUser to modify it before sending
        const updatedUser = { ...this.editedUser };

        // Remove fields that shouldn't be sent to the backend
        delete updatedUser.profileImage;
        if (!updatedUser.password) {
          // Remove password if it's empty
          delete updatedUser.password;
        }

        // API request to update the user profile
        const response = await Api.patch(`/users/${localUser._id}`, updatedUser, config);

        // Update localStorage with the updated user data
        localStorage.setItem('user', JSON.stringify(response.data));

        // Sync the user data after successful update
        this.user = { ...response.data }; // Correctly update `user`
        this.editedUser = { ...this.user }; // Keep the editedUser up-to-date

        // Exit edit mode
        this.editMode = false;

        // Show success message
        this.message = { type: 'success', text: 'Profile updated successfully!' };

        this.showAlert();
      } catch (error) {
        const errorMsg = error.response?.data?.message || 'Failed to update profile.';

        // Set the alert's message to type error and the error message
        this.message = { type: 'error', text: errorMsg };
        this.showAlert();
      } finally {
        // Enable the button again
        this.isSaving = false;
      }
    },
  },
};
</script>

<style scoped>
.edit-profile {
  display: flex;
  flex-direction: column;
  row-gap: 5px;
  border-radius: 10px;
  width: 100%;
  height: 100%;
  padding: 20px;
}

.profile-title {
  color: grey;
  font-size: 20px;
  font-weight: 550;
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

.user-name {
  font-weight: bold;
  margin: 0;
}

.username {
  font-weight: bold;
  color: #808080;
  margin: 0;
}

label {
  display: block;
  color: #808080;
  font-weight: bold;
  text-align: left;
}

input {
  width: 100%;
  padding: 10px;
  border-radius: 10px;
  border: none;
  background-color: #e7e7e7;
  font-weight: bold;
}

input:disabled {
  background-color: #d7d7d7;
}

.button-group {
  display: flex;
  gap: 10px;
}

.save-button {
  background-color: #007769;
  color: white;
  padding: 10px;
  border-radius: 10px;
  border: none;
  cursor: pointer;
  font-weight: bold;
}

.save-button:disabled {
  background-color: #818080;
  cursor: not-allowed;
}

.cancel-button {
  background-color: #a5a4a4;
  color: white;
  padding: 10px;
  border-radius: 10px;
  border: none;
  cursor: pointer;
  font-weight: bold;
}

.field {
  display: flex;
  flex-direction: column;
  row-gap: 10px;
}
</style>
