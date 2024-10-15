<template>
  <div class="edit-profile d-flex flex-column row-gap-4">
    <h2 class="profile-title">Edit Profile</h2>

    <div class="d-flex flex-column row-gap-4">
      <!-- User's First Name and Username -->
      <div class="d-flex flex-row column-gap-2 justify-content-start align-items-center">
        <div class="profile-image-container">
          <img :src="profileImagePreview || this.profileImage"
               alt="profile image"
               style="height: 70px; width: 70px; border-radius: 15px;"
          />
          <input type="file" ref="fileInput" @change="handleFileChange" accept="image/*" style="display: none;" />
          <button @click="triggerFileInput" class="change-photo-btn">Change Photo</button>
        </div>
        <div>
          <h2 class="user-name">{{ user.firstName || 'User' }}</h2>
          <p class="username">@{{ user.username }}</p>
        </div>
      </div>

      <!-- Form to edit profile -->
      <form class="d-flex flex-column row-gap-2" @submit.prevent="saveProfile">
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
            type="submit"
            :disabled="!hasChanges || !isFormValid || isSaving"
            class="save-button d-flex flex-grow-1 justify-content-center"
          >
            {{ isSaving ? 'Saving...' : 'Save' }}
          </button>
          <button
            v-else
            type="button"
            @click="toggleEditMode"
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
      user: {
        emailAddress: '',
        username: '',
        password: '',
        firstName: '',
        lastName: '',
        profileImage: '',
      },
      editedUser: {},
      isSaving: false,
      token: localStorage.getItem('token'),
      message: {
        type: '',
        text: '',
      },
      editMode: false,
      alertShown: false,
      passwordPlaceholder: '********',
      profileImageFile: null,
      profileImagePreview: null,
      defaultAvatar,
    };
  },
  created() {
    this.loadUser();
  },
  computed: {
    hasChanges() {
      return (
        this.user.firstName !== this.editedUser.firstName ||
        this.user.lastName !== this.editedUser.lastName ||
        this.user.username !== this.editedUser.username ||
        this.user.emailAddress !== this.editedUser.emailAddress ||
        (this.editedUser.password && this.editedUser.password !== '') ||
        this.profileImageFile !== null
      );
    },
    isEmailValid() {
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return emailPattern.test(this.editedUser.emailAddress);
    },
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
    loadUser() {
      const localUser = JSON.parse(localStorage.getItem('user'));
      if (localUser) {
        this.user = { ...localUser };
        this.editedUser = { ...this.user, password: '' };
        this.profileImagePreview = this.user.profileImg ? `${this.user.profileImg}` : this.defaultAvatar;
      }
    },
    toggleEditMode() {
      this.editMode = !this.editMode;
      if (!this.editMode) {
        this.cancelEdit();
      }
    },
    showAlert() {
      this.alertShown = true;
      setTimeout(() => {
        this.alertShown = false;
        if(this.message.type === 'success'){
          window.location.reload();
        }
      }, 1500);
    },
    cancelEdit() {
      this.editedUser = { ...this.user };
      this.editMode = false;
      this.message.text = '';
      this.profileImageFile = null;
      this.profileImagePreview = null;
    },
    triggerFileInput() {
      this.$refs.fileInput.click();
    },
    handleFileChange(event) {
      const file = event.target.files[0];
      if (file) {
        this.profileImageFile = file;
        this.profileImagePreview = URL.createObjectURL(file);
      }
    },
    async saveProfile() {
      this.isSaving = true;
      this.message.text = '';

      try {
        const localUser = JSON.parse(localStorage.getItem('user'));
        const formData = new FormData();

        Object.keys(this.editedUser).forEach(key => {
          if (this.editedUser[key] !== '' && this.editedUser[key] !== this.user[key]) {
            formData.append(key, this.editedUser[key]);
          }
        });

        if (this.profileImageFile) {
          formData.append('profileImg', this.profileImageFile);
        }

        const config = {
          headers: {
            'Authorization': `Bearer ${this.token}`,
            'Content-Type': 'multipart/form-data',
          },
        };

        const response = await Api.patch(`/users/${localUser._id}`, formData, config);

        localStorage.setItem('user', JSON.stringify(response.data));
        this.user = { ...response.data };
        this.editedUser = { ...this.user, password: '' };
        this.editMode = false;
        this.message = { type: 'success', text: 'Profile updated successfully!' };
        this.showAlert();
      } catch (error) {
        const errorMsg = error.response?.data?.message || 'Failed to update profile.';
        this.message = { type: 'error', text: errorMsg };
        this.showAlert();
      } finally {
        this.isSaving = false;
      }
    }
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

.profile-image-container {
  position: relative;
}

.change-photo-btn {
  position: absolute;
  bottom: -10px;
  left: 50%;
  transform: translateX(-50%);
  background-color: #007769;
  color: white;
  border: none;
  border-radius: 5px;
  padding: 5px 10px;
  font-size: 12px;
  cursor: pointer;
}
</style>
