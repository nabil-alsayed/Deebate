import { createRouter, createWebHistory } from 'vue-router'

// Protect authentication routes with a meta field

const routes = [
  {
    path: '/',
    name: 'home',
    component: () => import('./views/Home.vue'),
    requireAuth: true
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('./views/Login.vue'),
    requireAuth: true
  },
  {
    path: '/signup',
    name: 'signup',
    component: () => import('./views/Signup.vue'),
    requireAuth: true
  },
  {
    path: '/profile',
    name: 'profile',
    component: () => import('./views/Profile.vue'),
    requireAuth: true
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
