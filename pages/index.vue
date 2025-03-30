<script setup lang="ts">

</script>

<template>
  <div class="min-h-screen flex flex-col gap-4 justify-center items-center">
    <h1 class="text-lg text-center mb-2">Welcome To My Website</h1>
    <p class="text-sm text-center mb-2">This is an authentication training website with a login feature using email and
      password and using the mongodb atlas database.</p>
    <NuxtLink to="/dashboard" class="px-4 py-2 bg-gray-600 text-white rounded-md mr-4">Dashboard</NuxtLink>
    <NuxtLink to="/login" class="px-4 py-2 bg-blue-600 text-white rounded-md mr-4">Login</NuxtLink>
  </div>
</template>

<style scoped></style>
