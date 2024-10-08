<template>
  <div v-if="arguments.length > 1" v-for="argument in arguments" :key="argument._id">
    <argument :argument="argument" :debate-id="debateId" />
  </div>

  <div v-else-if="arguments.length === 1" >
    <argument :argument="arguments[0]" :debate-id="debateId" />
  </div>

  <div v-else>
    <p>No arguments yet</p>
    <join-debate :debateId="debateId" :userId="userId"/>
  </div>

</template>

<script>
import Argument from "@/components/debates/Argument.vue";
import JoinDebate from "@/components/arguments/JoinDebate.vue";

export default {
  name: "ArgumentsList",
  components: { JoinDebate, Argument },
  props:["arguments", "debateId", "userId"],
}

</script>

<style scoped>

</style>
