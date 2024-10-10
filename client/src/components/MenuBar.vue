<template>
  <div class="menubar">
    <div class="logo">
      <img src="@/assets/DeebateLogo.png" alt="Deebate Logo" />
      <h1 class="deebate-title">Deebate</h1>
    </div>

    <nav>
      <ul class="nav-items">
        <li @click="goHome">
          <a href="javascript:void(0);" class="nav-item">
            <i class="fa-solid fa-home"></i> Home
          </a>
        </li>
        <li @click="goToProfile">
          <a href="javascript:void(0);" class="nav-item">
            <i class="fa-solid fa-user"></i> Profile
          </a>
        </li>
      </ul>
    </nav>

    <button class="logout-btn"><i class="icon-logout"></i> Log out</button>
  </div>
</template>

<script>
export default {
  name: 'MenuBar',
  methods: {
    goToProfile() {
      this.$emit('profile-clicked')
    },
    goHome() {
      this.$emit('home-clicked')
    }
  }
}
</script>

<style scoped>
.menubar {
  background-color: #007769;
  color: white;
  height: 100vh;
  width: 300px;
  padding: 20px;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  gap: 30px;
  border-radius: 10px; /* Add border radius like right bar */
}

.logo {
  display: flex;
  align-items: center;
}

.logo img {
  max-width: 50px;
  height: auto;
}

.deebate-title {
  margin-left: 10px;
  font-size: 1.5rem;
}

nav ul {
  list-style-type: none; /* Remove bullet points */
  padding: 0;
}

.nav-items {
  display: flex;
  flex-direction: column;
  gap: 15px;
  margin-top: 20px;
}

.nav-item {
  color: white;
  text-decoration: none;
  padding: 10px;
  border-radius: 5px;
  transition: background-color 0.3s ease;
}

.nav-item:hover {
  background-color: rgba(255, 255, 255, 0.2);
}

.logout-btn {
  background-color: #bb4545;
  color: white;
  border: none;
  padding: 15px;
  border-radius: 20px;
  cursor: pointer;
  transition: background-color 0.3s ease;
  margin-top: auto;
}

.logout-btn:hover {
  background-color: #a13c3c;
}

/* Mobile styles */
@media (max-width: 576px) {
  .menubar {
    flex-direction: row;
    justify-content: space-between;
    height: auto;
    width: 100vw;
    padding: 10px 20px;
  }

  .logo img {
    max-width: 40px;
  }

  .deebate-title {
    font-size: 1.2rem;
  }

  .nav-items {
    flex-direction: row;
    gap: 10px;
  }

  .logout-btn {
    padding: 10px;
    font-size: 0.9rem;
    border-radius: 15px;
  }
}
</style>
