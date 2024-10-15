<template>

  <div  class="d-flex flex-column row-gap-3">
    <div v-if="arguments.length > 1"
         v-for="argument in arguments"
         :key="argument._id"
    >
      <argument @argument-deleted="handleArgumentDeleted" :argument="argument" :debate="debate"/>
    </div>
    <div v-else-if="arguments.length === 1">
      <argument @argument-deleted="handleArgumentDeleted" :argument="arguments[0]" :debate="debate" />
    </div>

    <div v-else>
      <p>No arguments yet</p>
      <h1> Join Debate </h1>
    </div>
  </div>
</template>

<script>
import Argument from '@/components/arguments/Argument.vue'
import JoinDebate from '@/components/arguments/JoinDebate.vue'
export default {
  name: 'ArgumentsList',
  computed: {
    argument() {
      return argument
    }
  },
  components: { JoinDebate, Argument },
  data() {
    return {
      argumentsList: this.arguments
    }
  },
  props: {
    arguments: {
      type: Array,
      required: true
    },
    debate: {
      type: String,
      required: true
    },
    user: {
      type: String,
      required: true
    }
  },
  methods: {
    handleArgumentDeleted(index) {
      // Remove the argument at the given index
      this.$emit('update-arguments', this.arguments.filter((_, i) => i !== index))
    }
  }
}

</script>

<style scoped>

</style>
