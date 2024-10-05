<template>
  <div class="menu-bar p-3 text-white justify-content-center h-100 w-auto flex flex-column rounded-4">
    <div class="logo w-100">
      <img :src="logoSrc" alt="Deebate Logo" />
      <h1>Deebate</h1>
      <p>Stand for your belief!</p>
    </div>

    <nav>
      <ul>
        <li>
          <router-link to="/" class="nav-item" active-class="active">
            <i class="fa fa-house"></i> Home
          </router-link>
        </li>
        <li>
          <router-link to="/profile" class="nav-item" active-class="active">
            <i class="fa-solid fa-user"></i> Profile
          </router-link>
        </li>
      </ul>
    </nav>

    <button class="logout-btn" @click="logout">
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
.menu-bar {
  background-color: #007769;
}

.logo {
  text-align: center;
  margin-bottom: 40px;
}

.logo img {
  height: auto;
  width: 85px;
}

.logo h1 {
  margin: 10px 0 5px;
  font-size: 1.5em;
}

.logo p {
  font-size: 0.8em;
  margin: 0;
}

nav ul {
  list-style-type: none;
  padding: 0;
}

.nav-item {
  display: block;
  color: white;
  text-decoration: none;
  padding: 10px;
  margin-bottom: 10px;
  border-radius: 5px;
  transition: background-color 0.3s ease;
}

.active,
.nav-item:hover {
  background-color: rgba(255, 255, 255, 0.2);
}

.logout-btn {
  margin-top: auto;
  background-color: #bb4545;
  color: white;
  border: none;
  padding: 15px;
  border-radius: 20px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.logout-btn:hover {
  background-color: #a13c3c;
}
</style>
