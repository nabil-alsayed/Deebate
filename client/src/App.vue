<template>
  <div id="app">
    <router-view :key="$route.params.userId"></router-view>
  </div>
</template>

<link rel="stylesheet" href="./styles.css">

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
</style>
