<template>
  <div class="argument-item p-3 mb-2 rounded shadow-sm">
    <p class="m-0">{{ argument.content }}</p>
  </div>
</template>

<script>
export default {
  name: "ArgumentItem",
  props: {
    argument: {
      type: Object,
      required: true,
    },
  },
};
</script>

<style scoped>
.argument-item {
  background-color: #f9f9f9;
  border-left: 4px solid #16b771;
}
</style>
