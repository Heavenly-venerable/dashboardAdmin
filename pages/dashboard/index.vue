<script setup lang="ts">
definePageMeta({
  middleware: ["authenticated"],
});

const { user, clear: clearSession } = useUserSession();

async function logout() {
  await clearSession();
  await navigateTo("/login");
}
</script>

<template>
  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
    <div class="bg-white shadow-lg rounded-lg p-6 w-full">
      <div class="flex items-center justify-between">
        <h3 class="text-lg font-semibold text-gray-700">Total Users</h3>
        <div class="p-2 flex items-center bg-blue-100 text-blue-600 rounded-full">
          <Icon class="w-4 h-4" name="material-symbols:person" />
        </div>
      </div>
      <div class="mt-4 flex items-center">
        <span class="text-2xl font-bold text-gray-900">2</span>
        <span class="ml-2 text-sm text-gray-500">this month</span>
      </div>
      <div class="mt-4 flex items-center text-sm text-green-500">
        <Icon class="w-4 h-4 z-10" name="material-symbols:trending-up-rounded" />
        <span class="ml-1 font-semibold">+100%</span>
        <span class="ml-2 text-gray-500">from last month</span>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
