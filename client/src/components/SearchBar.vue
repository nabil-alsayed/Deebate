<template>
  <div class="search-bar">
    <input type="text" placeholder="Search..." @input="onInput" />
  </div>
</template>

<script>
export default {
  methods: {
    onInput(event) {
      this.$emit('onSearch', event.target.value)
    }
  }
}
</script>

<style scoped>
.search-bar {
  margin-bottom: 20px;
}

input {
  width: 100%;
  padding: 10px;
  border-radius: 20px; /* Rounded corners */
  border: none;
  background-color: white; /* White */
}
</style>
