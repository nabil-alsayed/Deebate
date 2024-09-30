import { createRouter, createWebHistory } from 'vue-router'

import Home from './views/Home.vue'
import DebatesPage from './views/DebatesPage.vue'

const routes = [
  { path: '/', name: 'home', component: Home },
  {
    path: '/debates',
    name: 'DebatesPage',
    component: DebatesPage
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
