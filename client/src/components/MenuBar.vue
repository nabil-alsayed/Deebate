<template>
    <div class="menubar">
      <div class="logo">
        <img src="@/assets/DeebateLogo.png" alt="Deebate Logo">
        <h1>Deebate</h1>
        <p>Stand for your belief!</p>
      </div>

      <nav>
        <ul>
          <li>
            <router-link to="/profile" class="nav-item">
              <i class="fa-solid fa-user"></i> Profile
            </router-link>
          </li>
          <li>
            <router-link to="/start-debate" class="nav-item">
              <i class="fa-solid fa-plus"></i> Start Debate
            </router-link>
          </li>
          <li>
            <router-link to="/my-debates" class="nav-item">
              <i class="fa-solid fa-bars"></i> My Debates
            </router-link>
          </li>
          <li>
            <router-link to="/settings" class="nav-item">
              <i class="fa-solid fa-gears"></i> Settings
            </router-link>
          </li>
          <li>
            <router-link to="/about" class="nav-item">
              <i class="fa-solid fa-users"></i> About us
            </router-link>
          </li>
        </ul>
      </nav>

      <button class="logout-btn">
        <i class="icon-logout"></i> Log out
      </button>
    </div>
  </template>

<script>
export default {
  name: 'Menubar'
}
</script>

  <style scoped>
  .menubar {
    background-color: #007769;
    color: white;
    height: 98vh;
    padding: 20px;
    display: flex;
    flex-direction: column;
    border: none;
    border-radius: 30px;
  }

  .logo {
    text-align: center;
    margin-bottom: 40px;
  }

  .logo img {
    max-width: 100%;
    height: auto;
  }

  .logo h1 {
    margin: 10px 0 5px;
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

  .nav-item.router-link-active,
  .nav-item:hover {
    background-color: rgba(255, 255, 255, 0.2);
  }

  .logout-btn {
    margin-top: auto;
    background-color: #BB4545;
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
