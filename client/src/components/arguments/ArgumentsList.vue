<template>
  <div class="d-flex flex-column row-gap-3">
    <!-- Display list of arguments -->
    <div v-if="arguments.length > 0" v-for="argument in arguments" :key="argument._id">
      <argument :argument="argument" :debate-id="debateId" :key="argument._id" />
    </div>

    <!-- Show a message if no arguments exist -->
    <div v-else>
      <p>No arguments yet</p>
      <join-debate :debateId="debateId" :userId="userId" />
    </div>

    <!-- Load more arguments button -->
    <button v-if="canLoadMore" @click="loadMoreArguments" class="btn btn-secondary mt-3">
      Load More Arguments
    </button>
  </div>
</template>

<script>
import Argument from "@/components/arguments/Argument.vue";
import JoinDebate from "@/components/arguments/JoinDebate.vue";

export default {
  name: "ArgumentsList",
  components: { JoinDebate, Argument },
  props:["arguments", "debateId", "userId"],
}

</script>

<style scoped>

</style>
