import { createRouter, createWebHistory } from 'vue-router'
// import Landing from '../pages/Landing.vue'  // Comment for now
import Login from '../components/Auth/Login.vue'
import Signup from '../components/Auth/Signup.vue'
// import Dashboard from '../pages/Dashboard.vue'
// import Tickets from '../pages/Tickets/Tickets.vue'

const routes = [
  { path: '/', redirect: '/auth/login' },  // Temp: Redirect to working page
  { path: '/auth/login', component: Login },
  { path: '/auth/signup', component: Signup },
  // { path: '/dashboard', component: Dashboard, ... }  // Comment
  // { path: '/tickets', component: Tickets, ... }
  { path: '/:pathMatch(.*)*', redirect: '/auth/login' }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router