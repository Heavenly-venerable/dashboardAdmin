<script setup lang="ts">
definePageMeta({
  middleware: ["authenticated"]
})

const { user, clear: clearSession } = useUserSession()

async function logout() {
  await clearSession()
  await navigateTo("/login")
}
</script>

<template>
  <div>
    <h1 class="text-lg text-center mb-2">Welcome {{ user.email }}</h1>
    <NuxtLink to="/login" class="px-4 py-2 bg-blue-600 text-white rounded-md mr-4">Login</NuxtLink>
    <button @click="logout" class="px-4 py-2 bg-gray-600 text-white rounded-md">Logout</button>
  </div>
</template>

<style scoped></style>
