<script setup lang="ts">
definePageMeta({
  middleware: ["authenticated", "role-auth"],
  allowedRoles: ["admin", "moderator"]
})

const { data: userData, refresh } = await useFetch("/api/users")
const newUser = reactive(
  {
    username: '',
    email: '',
    password: '',
    role: 'user'
  }
)
const editingUser = ref(
  {
    id: '',
    username: '',
    email: '',
    password: '',
    role: 'user'
  }
)
const roles = ['admin', 'moderator', 'user']
const showModal = ref(false)
const showEditModal = ref(false)
const showToast = ref(false)
const showConfirmDelete = ref(false)
const toastMessage = ref("")
const userToDelete = ref(null)

const refreshUser = () => {
  refresh()
}

const confirmDeleteUser = (userId) => {
  userToDelete.value = userId
  showConfirmDelete.value = true
}

const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  return date.toLocaleString('id-ID', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

const roleClass = (role: 'admin' | 'moderator' | 'user') => {
  switch (role) {
    case 'admin':
      return 'bg-blue-500 text-white'
    case 'moderator':
      return 'bg-yellow-500 text-white'
    case 'user':
      return 'bg-green-500 text-white'
    default:
      return ''
  }
}

const addUser = async () => {
  try {
    await $fetch("/api/users/", {
      method: "POST",
      body: newUser
    })

    toastMessage.value = "User successfully added"

    showModal.value = false

    showToast.value = true

    setTimeout(() => showToast.value = false, 3000)

    refreshUser()
  } catch (error) {
    alert(error.message)
  }
}

const editUser = async (userId) => {
  const user = userData.value.users.find((u) => u._id === userId)

  if (user) {
    editingUser.value.id = user._id

    editingUser.value.username = user.username

    editingUser.value.email = user.email

    editingUser.value.role = user.role

    showEditModal.value = true

  }
}

const saveEditedUser = async () => {
  if (!editingUser.value.password || editingUser.value.password.trim() === "") {
    delete editingUser.value.password
  }

  try {
    await $fetch(`/api/users/${editingUser.value.id}`, {
      method: "PATCH",
      body: editingUser.value
    })

    editingUser.value = {
      id: '',
      username: '',
      email: '',
      password: '',
      role: 'user' // atau kamu bisa mengatur role ke nilai lain jika diperlukan
    }

    toastMessage.value = "User updated successfully"

    showEditModal.value = false

    showToast.value = true

    setTimeout(() => showToast.value = false, 3000)

    refreshUser()
  } catch (error) {
    alert(error.message)
  }
}

const deleteConfirmedUser = async () => {
  if (!userToDelete.value) return

  try {
    await $fetch(`/api/users/${userToDelete.value}`, {
      method: "DELETE",
    })

    showConfirmDelete.value = false

    userToDelete.value = null

    refreshUser()
  } catch (error) {
    alert(error.message)
  }
}
</script>

<template>
  <div class="p-4 min-h-screen">
    <div class="max-w-6xl mx-auto bg-white shadow-lg rounded-xl p-6">
      <div class="flex justify-between items-center mb-4">
        <h2 class="text-xl font-semibold text-gray-700">User Management</h2>
        <button @click="showModal = true" class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">Add
          User</button>
      </div>
      <div class="overflow-x-auto">
        <table class="w-full border-collapse rounded-lg shadow-sm overflow-hidden">
          <thead class="bg-gray-100 text-gray-600 uppercase text-sm leading-normal">
            <tr>
              <th class="px-6 py-3 text-left">No</th>
              <th class="px-6 py-3 text-left">ID</th>
              <th class="px-6 py-3 text-left">Username</th>
              <th class="px-6 py-3 text-left">Email</th>
              <th class="px-6 py-3 text-left">Role</th>
              <th class="px-6 py-3 text-left">Created At</th>
              <th class="px-6 py-3 text-left">Updated At</th>
              <th class="px-6 py-3 text-center">Actions</th>
            </tr>
          </thead>
          <tbody class="text-gray-700 text-sm divide-y divide-gray-200">
            <tr v-for="(user, index) in userData.users" :key="user._id" class="hover:bg-gray-50">
              <td class="px-6 py-4">{{ index + 1 }}</td>
              <td class="px-6 py-4">{{ user._id }}</td>
              <td class="px-6 py-4">{{ user.username }}</td>
              <td class="px-6 py-4">{{ user.email }}</td>
              <td class="px-6 py-4">
                <span class="px-3 py-1 rounded-full text-xs font-semibold" :class="roleClass(user.role)">
                  {{ user.role }}
                </span>
              </td>
              <td class="px-6 py-4">{{ formatDate(user.createdAt) }}</td>
              <td class="px-6 py-4">{{ formatDate(user.updatedAt) }}</td>
              <td class="px-6 py-4 text-center space-y-2">
                <button @click="editUser(user._id)"
                  class="px-3 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-600 mr-2">Edit</button>
                <button @click="confirmDeleteUser(user._id)"
                  class="px-3 py-1 bg-red-500 text-white rounded-md hover:bg-red-600">Delete</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    <Teleport to="body">
      <div v-if="showModal" class="fixed inset-0 p-4 flex items-center justify-center bg-black bg-opacity-50">
        <div class="bg-white p-6 rounded-lg shadow-lg w-96">
          <h3 class="text-lg font-semibold text-gray-700 mb-4">Add New User</h3>
          <div class="mb-4">
            <label class="block text-sm font-medium text-gray-600">Username</label>
            <input v-model="newUser.username" type="text"
              class="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:border-blue-300">
          </div>
          <div class="mb-4">
            <label class="block text-sm font-medium text-gray-600">Email</label>
            <input v-model="newUser.email" type="email"
              class="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:border-blue-300">
          </div>
          <div class="mb-4">
            <label class="block text-sm font-medium text-gray-600">Password</label>
            <input v-model="newUser.password" type="password"
              class="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:border-blue-300">
          </div>
          <div class="mb-4">
            <label class="block text-sm font-medium text-gray-600">Role</label>
            <select v-model="newUser.role"
              class="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:border-blue-300">
              <option v-for="role in roles" :key="role" :value="role">{{ role }}</option>
            </select>
          </div>
          <div class="flex justify-end space-x-2">
            <button @click="showModal = false"
              class="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600">Cancel</button>
            <button @click="addUser" class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">Save</button>
          </div>
        </div>
      </div>
    </Teleport>
    <Teleport to="body">
      <div v-if="showEditModal" class="fixed inset-0 p-4 flex items-center justify-center bg-black bg-opacity-50">
        <div class="bg-white p-6 rounded-lg shadow-lg w-96">
          <h3 class="text-lg font-semibold text-gray-700 mb-4">Add New User</h3>
          <div class="mb-4">
            <label class="block text-sm font-medium text-gray-600">Username</label>
            <input v-model="editingUser.username" type="text"
              class="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:border-blue-300">
          </div>
          <div class="mb-4">
            <label class="block text-sm font-medium text-gray-600">Email</label>
            <input v-model="editingUser.email" type="email"
              class="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:border-blue-300">
          </div>
          <div class="mb-4">
            <label class="block text-sm font-medium text-gray-600">Password</label>
            <input v-model="editingUser.password" type="password"
              class="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:border-blue-300">
          </div>
          <div class="mb-4">
            <label class="block text-sm font-medium text-gray-600">Role</label>
            <select v-model="editingUser.role"
              class="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:border-blue-300">
              <option v-for="role in roles" :key="role" :value="role">{{ role }}</option>
            </select>
          </div>
          <div class="flex justify-end space-x-2">
            <button @click="showEditModal = false"
              class="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600">Cancel</button>
            <button @click="saveEditedUser"
              class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">Save</button>
          </div>
        </div>
      </div>
    </Teleport>

    <Teleport to="body">
      <div v-if="showToast" class="fixed bottom-5 right-5 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg">
        {{ toastMessage }}
      </div>
    </Teleport>
    <Teleport to="body">
      <div v-if="showConfirmDelete" class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 p-4">
        <div class="bg-white p-6 rounded-lg shadow-lg w-96">
          <h3 class="text-lg font-semibold text-gray-700 mb-4">Confirm Delete</h3>
          <p class="text-gray-600">Are you sure you want to delete this user?</p>
          <div class="flex justify-end space-x-2 mt-4">
            <button @click="showConfirmDelete = false"
              class="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600">Cancel</button>
            <button @click="deleteConfirmedUser"
              class="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700">Delete</button>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>
