// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  runtimeConfig: {
    apiSecret: '',
    apiBaseUrl: '',
    // brevia integration session & auth credentials
    session: {
      name: '',
      secret: '',
    },
  },
  devtools: { enabled: process.env?.DEVTOOLS === 'true' ? true : false },
  imports: {
    autoImport: true,
  },
  modules: ['@nuxtjs/tailwindcss', '@nuxt/eslint', 'nuxt-icon'],
});
