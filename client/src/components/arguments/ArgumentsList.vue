<template>
  <div class="d-flex flex-column row-gap-2">
    <div v-if="arguments.length > 1"
         v-for="argument in arguments"
         :key="argument._id"
         class="d-flex flex-column row-gap-3"
    >
      <argument @argument-deleted="handleArgumentDeleted" :argument="argument" :debate="debate"/>
    </div>
    <div v-else-if="arguments.length === 1">
      <argument @argument-deleted="handleArgumentDeleted" :argument="arguments[0]" :debate="debate" />
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
      return this.argument
    }
  },
  components: { JoinDebate, Argument },
  data() {
    return {
      argumentsList: [...this.arguments]
    }
  },
  props: {
    arguments: {
      type: Array,
      required: true
    },
    debate: {
      type: Object,
      required: true
    },
  },
  methods: {
    handleArgumentDeleted(deletedArgumentId) {
      // Remove the argument by its _id
      this.argumentsList = this.argumentsList.filter(argument => argument._id !== deletedArgumentId)
      // Emit the updated list to the parent component if necessary
      this.$emit('update-arguments', this.argumentsList)
    }
  }
}

</script>

<style scoped>

</style>
