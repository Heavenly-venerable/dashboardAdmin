<script setup lang="ts">
const { clear: clearSession } = useUserSession()

const isSidebarOpen = ref(false);
const route = useRoute();
const isUserMenuOpen = ref(false);
const sidebarItems = [
  { title: "Overview", icon: "pie-chart", url: "/dashboard" },
  { title: "Users", icon: "person", url: "/dashboard/users" },
];

const isDashboardRoute = computed(() => route.path.startsWith('/dashboard'));

const toggleSidebar = () => {
  isSidebarOpen.value = !isSidebarOpen.value;
};

const toggleUserMenu = () => {
  isUserMenuOpen.value = !isUserMenuOpen.value;
};

const closeMenusOnClickOutside = (event: MouseEvent) => {
  const sidebar = document.getElementById('sidebar');
  const userMenu = document.getElementById('user-menu');
  const userButton = document.getElementById('user-button');

  if (sidebar && !sidebar.contains(event.target as Node)) {
    isSidebarOpen.value = false;
  }

  if (
    userMenu &&
    userButton &&
    !userMenu.contains(event.target as Node) &&
    !userButton.contains(event.target as Node)
  ) {
    isUserMenuOpen.value = false;
  }
};

async function logout() {
  await clearSession()
  await navigateTo("/login")
}

onMounted(() => {
  document.addEventListener('mousedown', closeMenusOnClickOutside);
});

onUnmounted(() => {
  document.removeEventListener('mousedown', closeMenusOnClickOutside);
});
</script>

<template>
  <div v-if="isDashboardRoute" class="relative">
    <nav class="flex items-center justify-between p-2 bg-white border-b border-gray-200">
      <button @click="toggleSidebar" type="button"
        class="inline-flex items-center justify-center p-2 text-gray-500 rounded-lg hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200">
        <span class="sr-only">Open sidebar</span>
        <Icon class="w-6 h-6" name="material-symbols:menu-rounded" mode="svg" />
      </button>
      <h1 class="text-xl font-bold text-gray-700">Dashboard</h1>
      <div class="relative">
        <button id="user-button" @click="toggleUserMenu"
          class="flex items-center p-2 text-gray-500 hover:bg-gray-100 rounded-lg focus:outline-none">
          <Icon class="w-8 h-8 z-10" name="material-symbols:account-circle" />
        </button>
        <transition name="fade">
          <div v-if="isUserMenuOpen" id="user-menu"
            class="absolute right-0 mt-2 w-48 z-50 bg-white border rounded-lg shadow-lg">
            <ul class="py-2">
              <li>
                <NuxtLink to="/dashboard/profile" class="block px-4 py-2 text-gray-700 hover:bg-gray-100">
                  Profile
                </NuxtLink>
              </li>
              <li>
                <NuxtLink to="/dashboard/settings" class="block px-4 py-2 text-gray-700 hover:bg-gray-100">
                  Settings
                </NuxtLink>
              </li>
              <li>
                <button @click="logout" class="w-full text-left px-4 py-2 text-gray-700">
                  Logout
                </button>
              </li>
            </ul>
          </div>
        </transition>
      </div>
    </nav>
    <div v-if="isSidebarOpen" class="fixed z-50 inset-0 bg-black bg-opacity-50 transition-opacity"></div>
    <transition name="slide">
      <aside id="sidebar" v-show="isSidebarOpen"
        class="fixed top-0 left-0 z-50 w-64 h-screen bg-white border-r border-gray-200 transition-transform sm:translate-x-0">
        <div class="overflow-y-auto py-5 px-3 h-full bg-white">
          <h2 class="text-3xl font-bold p-2">Dashboard</h2>
          <ul class="space-y-2 mt-4">
            <li v-for="item in sidebarItems" :key="item.title">
              <NuxtLink :to="item.url" class="flex items-center p-2 text-gray-900 rounded-lg hover:bg-gray-100">
                <Icon class="w-6 h-6 text-gray-400" :name="'material-symbols:' + item.icon" />
                <span class="ml-3">{{ item.title }}</span>
              </NuxtLink>
            </li>
          </ul>
        </div>
      </aside>
    </transition>
  </div>
</template>

<style scoped>
.slide-enter-active,
.slide-leave-active {
  transition: transform 0.3s ease-in-out;
}

.slide-enter-from,
.slide-leave-to {
  transform: translateX(-100%);
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease-in-out, transform 0.2s ease-in-out;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
</style>
