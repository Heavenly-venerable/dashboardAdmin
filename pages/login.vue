<script setup lang="ts">
const { loggedIn, user, fetch: refreshSession } = useUserSession();

const credentials = reactive({
  username: "",
  email: "",
  password: "",
});

async function login() {
  try {
    await $fetch("/api/auth/login", {
      method: "POST",
      body: credentials
    })

    await refreshSession()
    await navigateTo("/dashboard")
  } catch (error) {
    alert(error.message)
  }
}
</script>

<template>
  <section class="min-h-screen flex flex-col items-center justify-center px-6 py-8 mx-auto">
    <div class="w-full bg-white rounded-lg shadow">
      <div class="p-6 space-y-4">
        <h1 class="text-xl font-bold leading-tight tracking-tight text-gray-900">Sign in to your account</h1>
        <form @submit.prevent="login" class="space-y-4">
          <div>
            <label for="email" class="block mb-2 text-sm font-medium text-gray-900">Email</label>
            <input v-model="credentials.email" name="email" id="email"
              class="block w-full p-2.5 bg-gray-50 border border-gray-300 text-gray-900 rounded-lg" type="email"
              placeholder="jsmith@gmail.com" required />
          </div>
          <div>
            <label for="password" class="block mb-2 text-sm font-medium text-gray-900">Password</label>
            <input v-model="credentials.password" name="password" id="password"
              class="block w-full p-2.5 bg-gray-50 border border-gray-300 text-gray-900 rounded-lg" type="password"
              placeholder="Password" required />
          </div>
          <button type="submit"
            class="w-full px-5 py-2.5 text-white text-sm text-center bg-blue-600 font-medium rounded-lg">Submit</button>
        </form>
      </div>
    </div>
  </section>
</template>

<style scoped></style>
