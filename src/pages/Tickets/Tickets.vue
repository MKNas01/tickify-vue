<template>
  <div class="tickets-page-container">
    <!-- Sidebar -->
    <Sidebar @logout="handleLogout" v-model:is-open="sidebarOpen" />

    <!-- Overlay -->
    <div v-if="sidebarOpen" class="overlay" @click="sidebarOpen = false" />

    <!-- Main content -->
    <div class="app-wrapper">
      <main class="tickets-main">
        <button class="menu-toggle" @click="sidebarOpen = !sidebarOpen">
          <component :is="sidebarOpen ? X : Menu" :size="22" />
        </button>

        <h2>🎫 Manage Tickets</h2>

        <form class="ticket-form" @submit.prevent="handleSubmit">
          <div class="form-group">
            <label for="title">Title *</label>
            <input
              type="text"
              id="title"
              name="title"
              v-model="form.title"
              @input="handleInputChange"
              @blur="handleInputChange"
              placeholder="Enter ticket title"
              :aria-describedby="errors.title ? 'title-error' : undefined"
            />
            <small v-if="errors.title" id="title-error" class="error">{{ errors.title }}</small>
          </div>

          <div class="form-group">
            <label for="description">Description</label>
            <textarea
              id="description"
              name="description"
              v-model="form.description"
              @input="handleInputChange"
              @blur="handleInputChange"
              placeholder="Enter ticket description (min 10 chars if provided)"
              rows="4"
              :aria-describedby="errors.description ? 'desc-error' : undefined"
            ></textarea>
            <small v-if="errors.description" id="desc-error" class="error">{{ errors.description }}</small>
          </div>

          <div class="form-group">
            <label for="status">Status *</label>
            <select
              id="status"
              name="status"
              v-model="form.status"
              @input="handleInputChange"
              @blur="handleInputChange"
              :aria-describedby="errors.status ? 'status-error' : undefined"
            >
              <option value="open">Open</option>
              <option value="in_progress">In Progress</option>
              <option value="closed">Closed</option>
            </select>
            <small v-if="errors.status" id="status-error" class="error">{{ errors.status }}</small>
          </div>

          <button type="submit" class="submit-btn" :disabled="hasErrors">
            {{ form.id ? 'Update Ticket' : 'Create Ticket' }}
          </button>
        </form>

        <div class="tickets-list">
          <h3>All Tickets</h3>
          <p v-if="tickets.length === 0" class="no-tickets">No tickets available</p>
          <div
            v-else
            v-for="t in tickets"
            :key="t.id"
            class="ticket-card"
            :class="t.status"
          >
            <h4>{{ t.title }}</h4>
            <p>{{ t.description || 'No description provided' }}</p>
            <span class="status-tag" :aria-label="`Status: ${t.status}`">
              {{ t.status.replace('_', ' ') }}
            </span>
            <div class="card-actions">
              <button @click="handleEdit(t)" class="edit-btn">Edit</button>
              <button @click="handleDelete(t.id)" class="delete-btn">Delete</button>
            </div>
          </div>
        </div>
      </main>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useToast } from 'vue-toastification'
import { Menu, X } from 'lucide-vue-next'
import Sidebar from '../../components/Sidebar.vue'

const router = useRouter()
const toast = useToast()

const sidebarOpen = ref(false)
const tickets = ref([])
const form = reactive({
  id: null,
  title: '',
  description: '',
  status: 'open'
})
const errors = reactive({})

onMounted(() => {
  // Guard: Check session
  const session = localStorage.getItem('ticketapp_session')
  if (!session) {
    toast.error('Session expired — please log in again.', { timeout: 3000 })
    router.push('/auth/login')
    return
  }

  // Load tickets
  const stored = JSON.parse(localStorage.getItem('tickify_tickets')) || []
  tickets.value = stored
})

const saveTickets = (updated) => {
  localStorage.setItem('tickify_tickets', JSON.stringify(updated))
  tickets.value = updated
}

// Real-time validation
const validateField = (name, value) => {
  let error = ''
  switch (name) {
    case 'title':
      if (!value.trim()) error = 'Title is required'
      break
    case 'status':
      if (!['open', 'in_progress', 'closed'].includes(value)) error = 'Invalid status'
      break
    case 'description':
      if (value && value.length < 10) error = 'Description must be at least 10 characters'
      break
    default:
      break
  }
  return error
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
}

const validateForm = () => {
  const errs = {}
  Object.keys(form).forEach(key => {
    if (key !== 'id') {
      const error = validateField(key, form[key])
      if (error) errs[key] = error
    }
  })
  Object.assign(errors, errs)
  return Object.keys(errs).length === 0
}

const hasErrors = computed(() => Object.keys(errors).length > 0)

const handleSubmit = () => {
  if (!validateForm()) {
    toast.error('Please fix the errors below.', { timeout: 3000 })
    return
  }

  let updatedTickets
  if (form.id) {
    updatedTickets = tickets.value.map(t => (t.id === form.id ? { ...form } : t))
    toast.success('Ticket updated successfully!', { timeout: 2500 })
  } else {
    const newTicket = {
      ...form,
      id: Date.now(),
      createdAt: new Date().toLocaleString()
    }
    updatedTickets = [...tickets.value, newTicket]
    toast.success('Ticket created successfully!', { timeout: 2500 })
  }

  saveTickets(updatedTickets)
  form.id = null
  form.title = ''
  form.description = ''
  form.status = 'open'
  Object.keys(errors).forEach(key => delete errors[key])  // Clear errors
}

const handleDelete = (id) => {
  if (!confirm('Are you sure you want to delete this ticket?')) return
  const updated = tickets.value.filter(t => t.id !== id)
  saveTickets(updated)
  toast.success('Ticket deleted successfully!', { timeout: 2500 })
}

const handleEdit = (ticket) => {
  Object.assign(form, ticket)
  // Scroll to form
  const formEl = document.querySelector('.ticket-form')
  formEl?.scrollIntoView({ behavior: 'smooth' })
}

const handleLogout = () => {
  localStorage.clear()
  router.push('/')
}
</script>

<style lang="css">
/* Exact copy from React Tickets.css */
.tickets-page-container {
  display: flex;
  height: 100vh;
  background-color: var(--bg-light, #F9FAFB);
}

.app-wrapper {
  max-width: var(--max-width, 1440px);
  margin: 0 auto;
  padding: 0 20px;
  width: 100%;
  flex: 1;
}

.tickets-main {
  flex: 1;
  padding: 2rem;
  overflow-y: auto;
  word-break: break-word;
}

h2 {
  text-align: center;
  margin-bottom: 1.5rem;
  color: var(--dark-blue, #1E40AF);
  font-size: clamp(1.25rem, 3vw, 1.5rem);
}

.ticket-form {
  background: var(--white, #FFFFFF);
  border-radius: var(--border-radius, 12px);
  box-shadow: var(--shadow-md, 0 4px 6px rgba(0,0,0,0.1));
  padding: 1.5rem;
  margin-bottom: 2rem;
}

.form-group {
  margin-bottom: 1rem;
  display: flex;
  flex-direction: column;
}

label {
  font-weight: 600;
  margin-bottom: 0.4rem;
  color: var(--text-primary, #0F172A);
}

input,
textarea,
select {
  width: 100%;
  padding: 0.6rem;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  font-size: 1rem;
  outline-color: var(--light-blue);

}

textarea {
  resize: vertical;
  min-height: 80px;
}

.error {
  color: #dc2626;
  font-size: 0.85rem;
  margin-top: 0.25rem;
  display: block;
}

.submit-btn {
  background: var(--primary-blue, #3B82F6);
  color: var(--white, #FFFFFF);
  border: none;
  padding: 0.7rem 1.2rem;
  border-radius: 8px;
  cursor: pointer;
  transition: background 0.3s;
  width: 100%;
  font-weight: 500;
}

.submit-btn:hover {
  background: var(--dark-blue, #1E40AF);
}

.submit-btn:disabled {
  background: #9ca3af;
  cursor: not-allowed;
  opacity: 0.7;
}

.submit-btn:disabled:hover {
  background: #9ca3af;
}

/* Toast (unchanged) */
.toast {
  position: fixed;
  top: 1rem;
  right: 1rem;
  padding: 0.8rem 1.2rem;
  border-radius: 8px;
  color: white;
  z-index: 1000;
  font-weight: 500;
  animation: fadein 0.3s ease-in;
}

.toast.success {
  background-color: #16a34a;
}

.toast.error {
  background-color: #dc2626;
}

@keyframes fadein {
  from { opacity: 0; transform: translateY(-10px); }
  to { opacity: 1; transform: translateY(0); }
}

/* Tickets List */
.tickets-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.tickets-list h3 {
  font-size: 1.25rem;
  color: var(--text-primary, #0F172A);
  margin-bottom: 1rem;
}

.ticket-card {
  background: var(--white, #FFFFFF);
  padding: 1.25rem;
  border-radius: var(--border-radius, 12px);
  box-shadow: var(--shadow-md);
  position: relative;
  transition: transform 0.2s ease;
  display: flex;
  flex-direction: column;
}

.ticket-card:hover {
  transform: translateY(-2px);
}

.ticket-card h4 {
  margin-bottom: 0.5rem;
  color: var(--primary-blue, #3B82F6);
  font-weight: 600;
}

.ticket-card p {
  color: var(--text-muted, #64748B);
  margin-bottom: 1rem;
}

.status-tag {
  position: absolute;
  top: 1rem;
  right: 1rem;
  font-size: 0.8rem;
  font-weight: 600;
  text-transform: capitalize;
  padding: 0.3rem 0.6rem;
  border-radius: 6px;
  color: var(--white, #FFFFFF);
}

.ticket-card.open .status-tag {
  background-color: #16a34a; /* Green */
}

.ticket-card.in_progress .status-tag {
  background-color: #f59e0b; /* Amber */
}

.ticket-card.closed .status-tag {
  background-color: #6b7280; /* Gray */
}

.card-actions {
  margin-top: auto; /* Push to bottom */
  display: flex;
  gap: 0.5rem;
  padding-top: 1rem;
  border-top: 1px solid #e5e7eb;
}

.edit-btn,
.delete-btn {
  flex: 1;
  padding: 0.5rem;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.9rem;
  font-weight: 500;
  transition: background 0.2s ease;
}

.edit-btn {
  background: var(--light-blue, #60A5FA);
  color: var(--white, #FFFFFF);
}

.edit-btn:hover {
  background: var(--primary-blue, #3B82F6);
}

.delete-btn {
  background: #ef4444;
  color: var(--white, #FFFFFF);
}

.delete-btn:hover {
  background: #dc2626;
}

.no-tickets {
  text-align: center;
  color: var(--text-muted, #64748B);
  font-style: italic;
}

/* Mobile/Tablet (<=900px) */
.menu-toggle {
  display: none;
  background: var(--primary-blue, #3B82F6);
  color: var(--white, #FFFFFF);
  border: none;
  padding: 0.5rem 0.7rem;
  border-radius: 8px;
  cursor: pointer;
  margin-bottom: 1rem;
  z-index: 50;
}

.overlay {
  display: none;
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 30;
  cursor: pointer;
}

@media (max-width: 900px) {
  .app-wrapper {
    padding: 0 15px;
  }

  .menu-toggle {
    display: block;
    position: fixed;
    top: 1rem;
    left: 1rem;
    z-index: 60;
  }

  .overlay {
    display: block;
  }

  .tickets-main {
    padding: 5rem 1.5rem 2rem;
  }

  .ticket-form {
    padding: 1.25rem;
  }

  .tickets-list {
    gap: 1rem;
  }

  .card-actions {
    flex-direction: column;
  }

  /* Sidebar mobile (same as Dashboard) */
  .sidebar {
    position: fixed;
    top: 0;
    left: -260px;
    width: 250px;
    height: 100vh;
    background-color: var(--white, #FFFFFF);
    box-shadow: 2px 0 10px rgba(0, 0, 0, 0.06);
    transition: left 0.3s ease;
    z-index: 100;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }

  .sidebar.open {
    left: 0;
  }

  .sidebar-content {
    display: flex;
    flex-direction: column;
    align-items: stretch;
    padding-top: 1rem;
    flex-grow: 1;
  }

  .sidebar-close {
    display: flex;
    justify-content: flex-end;
    padding: 1rem;
    cursor: pointer;
  }
}

@media (max-width: 480px) {
  .tickets-main {
    padding: 4.5rem 1rem 1.5rem;
  }

  .ticket-form {
    padding: 1rem;
  }

  .ticket-card {
    padding: 1rem;
  }

  h2, .tickets-list h3 {
    font-size: 1.1rem;
  }
}

/* Desktop (>900px): Offset main, 2-col form, 3-col tickets */
@media (min-width: 901px) {
  .menu-toggle {
    display: none;
  }

  .overlay {
    display: none;
  }

  .tickets-main {
    margin-left: 250px;
    padding: 2.5rem;
    max-width: calc(100% - 250px);
  }

  .app-wrapper {
    padding: 0 30px;
  }

  /* Form: Inline labels on desktop */
  .form-group {
    flex-direction: row;
    align-items: center;
    gap: 1rem;
  }

  label {
    flex: 0 0 120px; /* Fixed label width */
    text-align: right;
    margin-bottom: 0;
  }

  input, textarea, select {
    flex: 1;
  }

  .submit-btn {
    width: auto;
    max-width: 200px;
    align-self: flex-end;
  }

  /* Tickets: 3-col grid */
  .tickets-list {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
    gap: 1.5rem;
  }

  .ticket-card {
    height: 100%; /* Equal height in grid */
  }

  .card-actions {
    flex-direction: row;
  }

  /* Sidebar desktop (same as Dashboard) */
  .sidebar {
    position: fixed;
    top: 0;
    left: 0;
    width: 250px;
    height: 100vh;
    background-color: var(--white, #FFFFFF);
    box-shadow: 2px 0 10px rgba(0, 0, 0, 0.06);
    z-index: 50;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
  }

  .sidebar-close {
    display: none;
  }
}
</style>