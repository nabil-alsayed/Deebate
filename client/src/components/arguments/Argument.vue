<template>
  <div class="d-flex flex-column px-3 py-3 rounded-4 shadow-sm">
    <!-- Display the argument content -->
    <div class="d-flex flex-row align-items-center column-gap-1">
      <img :src="this.owner.avatar || '../../../assets/avatars/avatar.png'"
           alt="User Avatar"
           class="rounded-circle"
           style="width: 48px;"
      >
      <h5 class="fw-bold">{{ this.owner.firstName }}</h5>
    </div>
    <div class="p-2 fs-5">
      <h6>{{ this.content }}</h6>
    </div>
    <div class="d-flex flex-row column-gap-2 align-items-center">
      <i class="bi bi-chat-fill text-muted"></i> <p class="fw-bold mb-0" style="font-size: 14px">{{ this.comments.length }}</p>
    </div>
  </div>
</template>

<script>

export default {
  name: "ArgumentItem",
  data() {
    return {
      argumentObj: null,
      content: '',
      owner: '',
      comments: [],
      votes: [],
    };
  },
  props: {
    argument: {
      type: Object,
      required: true,
    },
    debateId: {
      type: String,
      required: true,
    },
  },
  async mounted() {
    this.content = this.argument.content;
    this.owner = this.argument.owner;
    this.comments = this.argument.comments;
    this.votes = this.argument.votes;
  },
};
</script>

<style scoped>
.argument-item {
  background-color: #f9f9f9;
  border-left: 4px solid #16b771;
}
</style>
