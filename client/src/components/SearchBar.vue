<template>
    <input v-model="searchQuery" @input="filterDebates" placeholder="Search debates by topic" />
  </template>
  
  <script>
  export default {
    props: ['onSearch'],
    data() {
      return {
        searchQuery: ''
      }
    },
    methods: {
      filterDebates() {
        this.onSearch(this.searchQuery);
      }
    }
  }
  </script>
  