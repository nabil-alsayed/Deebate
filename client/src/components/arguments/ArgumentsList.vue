<template>

  <div  class="d-flex flex-column row-gap-3">
    <div v-if="arguments.length > 1"
         v-for="argument in arguments"
         :key="argument._id"
    >
      <argument :argument="argument" :debate="debate" />
    </div>
    <div v-else-if="arguments.length === 1" >
      <argument :argument="arguments[0]" :debate="debate" />
    </div>

    <div v-else>
      <p>No arguments yet</p>
      <h1> Join Debate </h1>
    </div>
  </div>
</template>

<script>
import Argument from "@/components/arguments/Argument.vue";
import JoinDebate from "@/components/arguments/JoinDebate.vue";

export default {
  name: "ArgumentsList",
  components: { JoinDebate, Argument },
  props: {
    arguments: {
      type: Array,
      required: true,
    },
    debate: {
      type: String,
      required: true,
    },
    user: {
      type: String,
      required: true,
    },
  },
}

</script>

<style scoped>

</style>
