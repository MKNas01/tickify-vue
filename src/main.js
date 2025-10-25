import { createApp } from 'vue'
import App from './App.vue'
import router from './router'  // Our routes
import 'vue-toastification/dist/index.css'  // Toast styles
import Toast from 'vue-toastification'
import './App.css'  // Global styles

const app = createApp(App)
app.use(router)
app.use(Toast, {  // Global toasts (like <Toaster />)
  position: 'top-center',
  timeout: 3000,
  closeOnClick: true,
  pauseOnHover: true,
})
app.mount('#app')