<template>
  <div id="app">
    <!-- <router-view :key="$route.params.userId"></router-view> -->
     <div>
      <div class="app-container">
        <img src="@/assets/illustrations/debate-list-empty.svg" alt="bye" />
        <h2 style="color: green;">
          see you after exams
        </h2> 
      </div>
     </div>
  </div>
</template>

<script>

export default {
  name: 'App'
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

.app-container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100vh;
  width: 100vw;
  background-color: #f5f5f5;
  color: #333;
}
</style>
