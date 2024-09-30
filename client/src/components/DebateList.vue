<template>
    <div>
        <ul>
            <li v-for="debate in debates" :key="debate._id">{{ debate.topic }}</li>
        </ul>
    </div>
</template>

<script>
import { Api } from '@/Api'

export default {
    data() {
        return {
            debates: []
        }
    },
    created() {
    this.getDebates()
  },
  methods: {
    getDebates() {
      Api.get('/v1/debates')
        .then(response => {
          this.debates = response.data.debates
        })
        .catch(error => {
          console.error(error)
        })
    }
  }
}
</script>
