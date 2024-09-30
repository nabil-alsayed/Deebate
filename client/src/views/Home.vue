<template>
  <div>
    <b-container fluid>
      <h1 class="display-5 fw-bold">DIT342 Frontend</h1>
      <p class="fs-4">Welcome to your DIT342 Frontend Vue.js App</p>
      <b-button class="btn_message" variant="primary" v-on:click="getDebates()" >Get Debates from Server</b-button>
      <p class="col-xl-9">Debates from the server:<br/>
        <ul>
          <li v-for="debate in message" :key="debate._id">{{ debate.topic }}</li>
        </ul>
      </p>
    </b-container>
  </div>
</template>

<script>
// @ is an alias to /src
import { Api } from '@/Api'

export default {
  name: 'home',
  data() {
    return {
      message: []
    }
  },
  methods: {
    getDebates() {
      Api.get('/v1/debates')
        .then(response => {
          this.message = response.data.debates
        })
        .catch(error => {
          this.message = error
        })
    }
  }
}
</script>

<style>
.btn_message {
  margin-bottom: 1em;
}
</style>
