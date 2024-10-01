import { createRouter, createWebHistory } from 'vue-router'

import Home from './views/Home.vue'

const routes = [
  { path: '/', name: 'home', component: Home },
  { path: '/auth', name: 'auth', component: () => import('./views/Auth.vue') },
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
