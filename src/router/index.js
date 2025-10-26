import { createRouter, createWebHistory } from 'vue-router'
import { useToast } from 'vue-toastification'  // Import composable (global, but per-guard)
import Landing from '../pages/Landing.vue'
import Login from '../components/Auth/Login.vue'
import Signup from '../components/Auth/Signup.vue'
import Dashboard from '../pages/Dashboard.vue'
import Tickets from '../pages/Tickets/Tickets.vue'

const routes = [
  { path: '/', component: Landing },
  { path: '/auth/login', component: Login },
  { path: '/auth/signup', component: Signup },
  { 
    path: '/dashboard', 
    component: Dashboard,
    beforeEnter: (to, from, next) => {
      const session = localStorage.getItem('ticketapp_session')
      if (session) next()
      else {
        const toast = useToast()  // Get instance
        toast.error('Your session has expired — please log in again.', { timeout: 3000 })
        next('/auth/login')
      }
    }
  },
  { 
    path: '/tickets', 
    component: Tickets,
    beforeEnter: (to, from, next) => {
      const session = localStorage.getItem('ticketapp_session')
      if (session) next()
      else {
        const toast = useToast()
        toast.error('Your session has expired — please log in again.', { timeout: 3000 })
        next('/auth/login')
      }
    }
  },
  { path: '/:pathMatch(.*)*', redirect: '/' }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router