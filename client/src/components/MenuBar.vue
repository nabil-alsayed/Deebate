<template>
  <div class="menu">
    <div class="logo">
      <img src="@/assets/logo.png" alt="Logo" />
      <h1>Deebate.me</h1>
    </div>
    <button
      @click="changePage('Home')"
      :class="{ active: activePage === 'Home' }"
    >
      Home
    </button>
    <button
      @click="changePage('Profile')"
      :class="{ active: activePage === 'Profile' }"
    >
      Profile
    </button>
    <button class="logout">Log Out</button>
  </div>
</template>

<script>
export default {
  props: ['activePage'],
  methods: {
    changePage(page) {
      this.$emit('changePage', page)
    }
  }
}
</script>

<style scoped>
.menu {
  padding: 20px;
}

.logo {
  display: flex;
  flex-direction: column;
  align-items: center;
}

button {
  width: 100%;
  background-color: #007769; /* Primary color */
  color: white;
  border: none;
  border-radius: 20px; /* Rounded corners */
  padding: 10px;
  margin-top: 10px;
}

button.active {
  background-color: #00df74; /* Green */
}

.logout {
  background-color: #bb4545; /* Red */
  color: white;
  margin-top: auto;
}
</style>
