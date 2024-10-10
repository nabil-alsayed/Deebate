<template>
  <div class="search-bar">
    <input
      type="text"
      v-model="searchQuery"
      @input="onSearchInput"
      placeholder="Search for a user"
      aria-label="Search for a user"
    />
    <button @click="performSearch">Search</button>
    <!-- Dropdown to show filtered users -->
    <ul v-if="filteredUsers.length" class="dropdown">
      <li v-for="user in filteredUsers" :key="user._id" @click="selectUser(user)">
        {{ user.username }}
      </li>
    </ul>
  </div>
</template>

<script>
import { ref } from 'vue'
import { Api } from '@/Api'

export default {
  name: 'SearchBar',
  emits: ['userSelected'],
  setup(props, { emit }) {
    const searchQuery = ref('')
    const users = ref([])
    const filteredUsers = ref([])

    async function fetchUsers() {
      const token = localStorage.getItem('token') // Get the stored token
      if (!token) {
        console.error('No auth token found. You need to log in.')
        return
      }

      try {
        const response = await Api.get('/v1/users', {
          headers: {
            Authorization: `Bearer ${token}` // Include the token in the request
          }
        })
        users.value = response.data.users
      } catch (error) {
        console.error('Error fetching users:', error)
      }
    }

    function onSearchInput() {
      if (searchQuery.value.length > 0) {
        // Filter users based on search input
        filteredUsers.value = users.value.filter(user =>
          user.username.toLowerCase().includes(searchQuery.value.toLowerCase())
        )
      } else {
        filteredUsers.value = []
      }
    }

    function selectUser(user) {
      searchQuery.value = user.username
      filteredUsers.value = [] // Clear dropdown after selection
      emit('userSelected', user) // Emit the selected user to parent
    }

    // Fetch all users when component is mounted
    fetchUsers()

    return {
      searchQuery,
      filteredUsers,
      onSearchInput,
      selectUser
    }
  }
}
</script>

<style scoped>
.search-bar {
  position: relative;
}

input {
  width: 100%;
  padding: 10px;
  font-size: 16px;
  border: 1px solid #ccc;
  border-radius: 4px;
}

button {
  margin-left: 10px;
  padding: 10px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
}

.dropdown {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background-color: white;
  border: 1px solid #ccc;
  border-radius: 4px;
  max-height: 200px;
  overflow-y: auto;
  list-style: none;
  padding: 0;
}

.dropdown li {
  padding: 10px;
  cursor: pointer;
}

.dropdown li:hover {
  background-color: #f0f0f0;
}
</style>
