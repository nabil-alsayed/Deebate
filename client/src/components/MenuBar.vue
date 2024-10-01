<template>
    <div class="sidebar">
        <div>
            <img src = "D:\SEM2023\WebDev_1_period\group-19-web\client\src\assets\DeebateLogo.png" alt="Deebate Logo">
            <h1>Deebate</h1>
            <p>Stand for your belief!</p>
        </div>

        <nav>
            <ul>
                <li><router-link to="/" class="nav-item active">
                    <i class="icon-home"></i> Home
                </router-link></li>
                <li><router-link to="/profile" class="nav-item">
                    <i class="icon-profile"></i> Profile
                </router-link></li>
            </ul>
        </nav>
        <button class="logout-btn">
            <i class="icon-logout"></i> Log out
        </button>
    </div>
</template>

<script>
export default {
    name: 'MenuBar'
}
</script>

<style>
.sidebar {
    background-color: #007769;
    color: white;
    height: 100vh;
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

.nav item {
    display: block;
    color: white;
    text-decoration: none;
    padding: 10px;
    margin-bottom: 10px;
    border-radius: 5px;
}

.nav-item.active, .nav-item:hover {
    background-color: rgba(255, 255, 255, 0.2);
}

.logout-btn {
    margin-top: auto;
    background-color: #BB4545;
    color:white;
    border: none;
    padding: 10px;
    border-radius: 5px;
    cursor: pointer;
}
</style>
