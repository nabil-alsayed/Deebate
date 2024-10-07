<template>
  <div class="d-flex flex-column primary-color text-white h-100 p-3 rounded-4" style="width: 250px">
    <!-- Logo Section -->
    <div class="text-center mb-4">
      <img :src="logoSrc" alt="Deebate Logo" class="logo img-fluid mb-2"/>
      <h1>Deebate</h1>
      <p>Stand for your belief!</p>
    </div>

    <!-- Navigation Section -->
    <nav class="flex-grow-1 flex-column py-5 justify-content-center">
      <ul class="nav flex-column">
        <li class="nav-item mb-2">
          <router-link to="/" class="nav-link text-white" active-class="active">
            <i class="fa fa-house"></i> Home
          </router-link>
        </li>
        <li class="nav-item mb-2">
          <router-link to="/profile" class="nav-link text-white" active-class="active">
            <i class="fa-solid fa-user"></i> Profile
          </router-link>
        </li>
      </ul>
    </nav>

    <!-- Logout Button -->
    <button class="logout-btn mt-auto" @click="logout">
      <i class="icon-logout"></i> Log out
    </button>
  </div>
</template>


<script>
import logoSrc from '/logo/deebate-logo-light.png';

export default {
  name: 'MenuBar',
  data() {
    return {
      logoSrc
    };
  },
  methods: {
    logout() {
      if (localStorage.getItem('token')) {
        localStorage.removeItem('token');
      }
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
}

p {
  font-size: 0.9em;
  margin: 0;
}

nav ul {
  list-style-type: none;
  padding: 0;
}

.nav-link {
  color: white;
  text-decoration: none;
  border-radius: 15px;
  padding: 10px;
  transition: background-color 0.3s ease;
}

.active,
.nav-link:hover {
  background-color: rgba(255, 255, 255, 0.2);
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

