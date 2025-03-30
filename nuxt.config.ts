// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: false },
  modules: ['@nuxtjs/tailwindcss', 'nuxt-auth-utils', '@nuxt/icon'],
  nitro: {
    plugins: ["~/server/index.ts"],
  },
})