import { createRouter, createWebHistory } from 'vue-router'

// Protect authentication routes with a meta field

const routes = [
  {
    path: '/',
    name: 'home',
    component: () => import('./views/Home.vue'),
    meta: { requireAuth: true }
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('./views/Login.vue'),
  },
  {
    path: '/signup',
    name: 'signup',
    component: () => import('./views/Signup.vue'),
  },
  {
    path: '/profile',
    name: 'profile',
    component: () => import('./views/Profile.vue'),
    meta: { requireAuth: true }
  },
  {
    path: '/users/:userId',  // This is the dynamic route for user profiles
    name: 'UserProfile',
    component: () => import('./views/UserProfile.vue'),  // The ProfileInfo component
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// Add a navigation guard to protect routes that require authentication
router.beforeEach((to, from, next) => {
  const isAuth = localStorage.getItem('token');

  if (to.meta.requireAuth && !isAuth) {
    next('/login');  // Redirect to login if not authenticated
  } else if ((to.name === 'login' || to.name === 'signup') && isAuth) {
    // If the user is authenticated and trying to access login or signup, redirect to home
    next('/');
  } else {
    next();
  }

  if (to.meta.requireAuth && isAuth) {
    next('/'); // Redirect to home if authenticated
  }
});


export default router
