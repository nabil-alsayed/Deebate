<template>
  <div class="d-flex flex-column primary-color text-white h-100 p-3 rounded-4" style="min-width: 210px">
    <!-- Logo Section -->
    <div class="text-center mb-4">
      <img :src="logoSrc" alt="Deebate Logo" class="logo img-fluid mb-2"/>
      <h1>Deebate</h1>
      <p>Stand for your belief!</p>
    </div>

    <!-- Navigation Section -->
    <nav class="flex-grow-1 flex-column py-5 justify-content-center">
      <ul class="nav flex-column text-start">
        <li class="nav-item mb-2">
          <router-link to="/" class="nav-link text-white px-4" active-class="active">
            <i class="bi bi-house-fill"></i> <span>Home</span>
          </router-link>
        </li>
        <li class="nav-item mb-2">
          <router-link to="/profile" class="nav-link text-white px-4" active-class="active">
            <i class="bi-person-fill"></i> Profile
          </router-link>
        </li>
      </ul>
    </nav>

    <!-- Logout Button -->
    <button class="logout-btn mt-auto" style="font-weight: 800" @click="logout">
      Log out
    </button>
  </div>
</template>


<script>
import logoSrc from '/logo/deebate-logo-light.png';
import 'bootstrap-icons/font/bootstrap-icons.css';

export default {
  name: 'MenuBar',
  data() {
    return {
      logoSrc
    };
  },
  methods: {
    logout() {
      localStorage.clear();
      this.$router.push('/login');
    }
  }
};
</script>


<style scoped>
.primary-color {
  background-color: #007769;
}

.logo {
  max-width: 100px;
  height: auto;
}

h1 {
  margin-top: 10px;
  font-size: 1.5em;
  font-weight: 800;
}

p {
  font-size: 0.9em;
  margin: 0;
}

nav ul {
  list-style-type: none;
  padding: 0;
  font-weight: 600;
}

.nav-link {
  color: white;
  text-decoration: none;
  border-radius: 15px;
  padding: 10px;
  transition: background-color 0.3s ease;
}

/* Ensures the active link is styled correctly */
.nav-link.active {
  background-color: #16B771;
  color: white;
}

/* Hover styling, only applied when the link is not active */
.nav-link:hover:not(.active) {
  background-color: rgba(22, 183, 113, 0.17);
}

.logout-btn {
  background-color: #bb4545;
  color: white;
  border: none;
  padding: 12px;
  border-radius: 15px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.logout-btn:hover {
  background-color: #a13c3c;
}
</style>

