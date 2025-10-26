import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import 'vue-toastification/dist/index.css'
import Toast, { POSITION } from 'vue-toastification'
import './App.css'

const app = createApp(App)
app.use(router)
app.use(Toast, {
  position: POSITION.TOP_CENTER,
  timeout: 2000,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
  draggablePercent: 0.6,
  showCloseButtonOnHover: false,
  hideProgressBar: false,
  closeButton: 'button',
  icon: true,
  rtl: false,
  // Fix for RC bug: Define positions explicitly
  positions: {
    TOP_CENTER: 'top-center',
    TOP_LEFT: 'top-left',
    TOP_RIGHT: 'top-right',
    BOTTOM_CENTER: 'bottom-center',
    BOTTOM_LEFT: 'bottom-left',
    BOTTOM_RIGHT: 'bottom-right'
  },
  maxToasts: 3,
  newestOnTop: true
})
app.mount('#app')