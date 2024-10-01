import { createRouter, createWebHistory } from 'vue-router'

import Home from './views/Home.vue'

const routes = [
  { path: '/', name: 'home', component: Home },
  { path: '/login', name: 'login', component: () => import('./views/Login.vue') },
  { path: '/signup', name: 'signup', component: () => import('./views/Signup.vue') },
  { path: '/profile', name: 'profile', component: () => import('./views/Profile.vue') },
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
