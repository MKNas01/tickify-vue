<template>
  <main class="auth-page">
    <div class="auth-box">
      <h1>Welcome Back 👋</h1>
      <p>Login to your Tickify account</p>

      <form @submit.prevent="handleSubmit" novalidate>
        <div class="form-group">
          <label for="email">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            placeholder="Enter your email"
            v-model="form.email"
            @input="handleInputChange"
            @blur="handleInputChange"
            :aria-describedby="errors.email ? 'email-error' : undefined"
          />
          <span v-if="errors.email" id="email-error" class="error">{{ errors.email }}</span>
        </div>

        <div class="form-group">
          <label for="password">Password</label>
          <input
            :type="showPassword ? 'text' : 'password'"
            id="password"
            name="password"
            placeholder="Enter your password"
            v-model="form.password"
            @input="handleInputChange"
            @blur="handleInputChange"
            :aria-describedby="errors.password ? 'password-error' : undefined"
          />
          <button
            type="button"
            @click="showPassword = !showPassword"
            class="toggle-password-btn"
            :aria-label="showPassword ? 'Hide password' : 'Show password'"
          >
            <component :is="showPassword ? EyeOff : Eye" :size="18" />
          </button>
          <span v-if="errors.password" id="password-error" class="error">{{ errors.password }}</span>
        </div>

        <button type="submit" class="btn-primary full-width" :disabled="hasErrors">
          Login
        </button>

        <p class="switch-link">
          Don’t have an account? <RouterLink to="/auth/signup">Sign up</RouterLink>
        </p>
      </form>
    </div>
  </main>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useToast } from 'vue-toastification'
import { Eye, EyeOff } from 'lucide-vue-next'

const router = useRouter()
const toast = useToast()

const showPassword = ref(false)
const form = reactive({ email: '', password: '' })
const errors = reactive({})

// Real-time validation function
const validateField = (name, value) => {
  switch (name) {
    case 'email':
      if (!value.trim()) return 'Email is required'
      if (!/\S+@\S+\.\S+/.test(value)) return 'Invalid email format'
      return ''
    case 'password':
      if (!value) return 'Password is required'
      if (value.length < 6) return 'Password must be at least 6 characters'
      return ''
    default:
      return ''
  }
}

// Full form validation function (defined before handleSubmit)
const validate = () => {
  const newErrors = {}
  Object.keys(form).forEach(key => {
    const error = validateField(key, form[key])
    if (error) newErrors[key] = error
  })
  Object.assign(errors, newErrors)
  console.log('Full validation errors:', newErrors)  // Debug
  return newErrors
}

const handleInputChange = (e) => {
  const { name, value } = e.target
  form[name] = value

  const error = validateField(name, value)
  if (error) {
    errors[name] = error
  } else {
    delete errors[name]
  }
  console.log('Input change:', name, value, 'Error:', error)  // Debug
}

const hasErrors = computed(() => Object.keys(errors).length > 0)

const handleSubmit = () => {
  console.log('Submit triggered, form:', form, 'Errors:', errors)
  try {
    const validationErrors = validate()
    if (Object.keys(validationErrors).length > 0) {
      console.log('Validation failed')
      toast.error('Please fix the errors below.', { 
        timeout: 3000,
        type: 'error',  // Explicit red
        icon: '❌'
      })
      return
    }

    console.log('Validation passed')
    const storedUser = JSON.parse(localStorage.getItem('tickify_user') || 'null')
    console.log('Stored user:', storedUser)
    if (!storedUser || storedUser.email !== form.email || storedUser.password !== form.password) {
      toast.error('Invalid credentials. Please try again.', { 
        timeout: 3000,
        type: 'error',
        icon: '❌'
      })
      return
    }

    localStorage.setItem('ticketapp_session', JSON.stringify({ email: form.email }))
    console.log('Session set')
    toast.success('Login successful!', { 
      timeout: 2000,  // Slightly longer
      type: 'success',  // Explicit green
      icon: '✅',  // Green check
      position: 'top-center'
    })
    setTimeout(() => {
      console.log('Redirecting to dashboard')
      router.push('/dashboard')
    }, 1000)  // Delay 1.5s for toast visibility
  } catch (err) {
    console.error('Submit error:', err)
    toast.error('An unexpected error occurred.', { timeout: 3000 })
  }
}

</script>

<style lang="css">
/* Auth CSS - Exact React + Fixes for Parity */
.auth-page {
  background: #f9fafb;
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  font-family: 'Inter', 'Poppins', sans-serif;
  padding: 1rem; /* Slight padding for mobile edge */
}

.auth-box {
  background: #fff;
  padding: 2.5rem;
  border-radius: 14px;
  box-shadow: 0 8px 30px rgba(2, 6, 23, 0.08);
  width: 100%;
  max-width: 400px; /* Fixed width to match React */
}

.auth-box h1 {
  color: #0f172a;
  margin-bottom: 0.5rem;
  font-size: 1.6rem;
}

.auth-box p {
  color: #64748b;
  margin-bottom: 1.5rem;
}

.form-group {
  margin-bottom: 1rem;
  position: relative; /* For toggle positioning */
  display: flex;
  flex-direction: column; /* Default column (mobile/React base) */
}

.form-group label {
  font-weight: 600;
  color: #0f172a;
  margin-bottom: 0.3rem;
  display: block;
}

.form-group input {
  width: 100%;
  padding: 0.6rem 2.5rem 0.6rem 0.6rem; /* Right padding for toggle */
  border-radius: 8px;
  border: 1px solid #d1d5db;
  font-size: 1rem;
  background: #f8f9ff; /* Light blue-white tint to match React's "light blue" feel */
  transition: background 0.2s ease, border-color 0.2s ease;
  height: 42px;
  box-sizing: border-box;
}

.form-group input:focus {
  background: #f0f8ff; /* Lighter blue on focus for parity */
  border-color: #3b82f6;
  outline: none;
}

.toggle-password-btn {
  position: absolute;
  right: 10px;
  top: 50%; /* Align with input */
  transform: translateY(-50%);
  background: none;
  border: none;
  cursor: pointer;
  color: #555;
}

.error {
  color: #ef4444;
  font-size: 0.875rem;
  margin-top: 0.25rem;
  display: block;
}

.btn-primary.full-width {
  background: linear-gradient(90deg, #3b82f6, #60a5fa);
  color: #fff;
  border: none;
  width: 100%;
  padding: 0.8rem;
  font-weight: 600;
  border-radius: 10px;
  cursor: pointer;
  transition: background 0.2s;
}

.btn-primary.full-width:hover:not(:disabled) {
  background: #1e40af;
}

.btn-primary.full-width:disabled {
  background: #9ca3af;
  cursor: not-allowed;
  opacity: 0.7;
}

.switch-link {
  margin-top: 1rem;
  font-size: 0.95rem;
  text-align: center;
}

/* Desktop Row Layout (side-by-side label/input - add for parity if React has it) */
@media (min-width: 901px) {
  .form-group {
    flex-direction: row;
    align-items: center;
    gap: 1rem;
  }

  .form-group label {
    flex: 0 0 120px; /* Fixed label width */
    text-align: right;
    margin-bottom: 0;
  }

  .form-group input {
    flex: 1;
    max-width: 250px; /* Shorten input length to match React */
  }

  .toggle-password-btn {
    top: 50%; /* Center vertically in row */
    transform: translateY(-50%);
  }
}

/* Mobile Responsive (column, tighter) */
@media (max-width: 480px) {
  .auth-page {
    padding: 0.5rem;
  }

  .auth-box {
    padding: 2rem;
    margin: 1rem;
  }

  .auth-box h1 {
    font-size: 1.4rem;
  }

  .form-group input {
    height: 40px;
  }
}
</style>