<template>
  <router-view v-slot="{ Component }">
    <component :is="Component" v-if="isAuthenticated" />
    <router-view v-else />
  </router-view>
</template>

<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const isAuthenticated = computed(() => {
  return !!localStorage.getItem('ticketapp_session')
})

// Redirect if not auth (handled in routes, but wrapper for sub-routes if needed)
</script>