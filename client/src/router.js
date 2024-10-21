import { createRouter, createWebHistory } from 'vue-router'
import { jwtDecode } from "jwt-decode";

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
    component: () => import('./views/UserProfile.vue'),
    meta: { requireAuth: true }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

const isTokenExpired = () => {
  const token = localStorage.getItem('token');
  if (!token) return true;
  const currentTime = Date.now() / 1000;
  const decoded = jwtDecode(token);

  return decoded.exp < currentTime;
}

// Add a navigation guard to protect routes that require authentication
router.beforeEach((to, from, next) => {
  const isAuth = localStorage.getItem('token');

  if (to.meta.requireAuth && (!isAuth || isTokenExpired())) {
    // Redirect to login if not authenticated
    return next('/login');
  } else if ((to.name === 'login' || to.name === 'signup') && isAuth && !isTokenExpired()) {
    // Redirect to home if authenticated and trying to access login or signup
    return next('/');
  }

  // If no condition matches, proceed with navigation
  next();
});


export default router
