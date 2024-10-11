<template>
  <div class="w-100 position-relative rounded-4 border border-opacity-10" style="background-color: #dfdfdf" >
    <div class="search-input d-flex flex-row align-items-center w-100"
         style="padding-left: 30px;"
    >
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="input-icon bi bi-search" viewBox="0 0 16 16">
        <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001q.044.06.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1 1 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0"/>
      </svg>
      <input
        type="text"
        v-model="searchQuery"
        class="user-input w-100 border-0 bv-no-focus-ring bg-transparent"
        placeholder="Search for users with username, email, first name or last name"
      >
    </div>

    <div v-if="filteredUsers.length > 0"
         class="user-list d-flex flex-column w-100 align-items-start border
         shadow-md position-absolute bg-white mt-1"
    >
      <div
        v-for="user in filteredUsers"
        :key="user._id"
        class="user-item d-flex flex-row column-gap-2 w-100 p-3 border-bottom border-light"
        @click="visitProfile(user._id)"
      >
        <img
          src="../../../public/logo/deebate-logo-dark.png"
          :alt="user.username"
          class="rounded-5"
          style="width: 40px; height: 40px;"
        />
        <div class="d-flex flex-column align-items-start">
          <div>
            <h1 class="m-0" style="font-size: 17px; color: black; font-weight: 800">{{ user.firstName }} {{ user.lastName }}</h1>

          </div>
          <div>
            <h1 class="fw-bold m-0" style="font-size: 15px; color: #9e9e9e">@{{ user.username }}</h1>
          </div>
        </div>
      </div>
    </div>
    <div v-else-if="searchQuery.length > 0 && !loading"
         class="d-flex p-3 flex-column w-100 mt-1 align-items-center
         border rounded-4 shadow-md position-absolute bg-white"
    >
      <h1 class="fs-6 fw-bold m-0">No Results Found.</h1>
    </div>
  </div>
</template>

<script>
import { ref, watch } from 'vue'
import { Api }  from '@/api/v1/Api.js'
import { useRouter } from "vue-router";

export default {
  name: 'SearchBar',
  setup() {
    const searchQuery = ref('')
    const filteredUsers = ref([])
    const loading = ref(false)
    const router = useRouter();


    // TODO: Move to API file
    // Function to fetch users based on search query
    const fetchUsers = async () => {
      // Fetch the token from local storage
      const token = localStorage.getItem('token');

      // Check if search qeury is not empty and that token is present
      if (searchQuery.value.trim().length > 0 && token) {
        loading.value = true;
        try {
          const response = await Api.get(`/users/search?search=${searchQuery.value}&limit=5`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          filteredUsers.value = response.data.users;
        } catch (error) {
          console.error('Error fetching users:', error);
          filteredUsers.value = [];
        } finally {
          loading.value = false;
        }
      } else {
        filteredUsers.value = [];
      }
    }

    // Debounce function to avoid making API calls for every keystroke
    let timeout;
    const debounceSearch = () => {
      clearTimeout(timeout);
      timeout = setTimeout(() => {
        fetchUsers();
      }, 200);
    }

    // Watch the searchQuery value and trigger search with debounce
    watch(searchQuery, debounceSearch);

    // Function to navigate to the user's profile
    const visitProfile = (userId) => {
      router.push({ path: `/users/${userId}` });
    };


    return {
      searchQuery,
      filteredUsers,
      loading,
      visitProfile
    }
  }
}
</script>

<style scoped>

.user-list {
  max-height: 300px;
  overflow-y: auto;
  border-radius: 25px;
}

.user-input {
  height: 48px;
}

.user-item {
  cursor: pointer;
  transition: background-color 0.2s;
}
.user-item:hover {
  background-color: #f9f9f9;
}

/* Style the input */
.search-input {
  width: 100%;
  padding-left: 40px;
  font-size: 16px;
}

/* Style the placeholder */
.search-input::placeholder {
  color: #7c7b7b;
  font-weight: 500;
}

.input-icon {
  position: absolute;
  left: 10px;
  top: 50%;
  transform: translateY(-50%);
  color: #979797;
  pointer-events: none;
}

input::placeholder {
  font-weight: 700;
  color: #999;
}
</style>
