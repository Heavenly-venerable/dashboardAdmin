// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: false },
  modules: ['@nuxtjs/tailwindcss', 'nuxt-auth-utils', '@nuxt/icon'],
  app: {
    pageTransition: { name: 'page', mode: 'out-in' }
  },
  nitro: {
    plugins: ["~/server/index.ts"],
  },
})
