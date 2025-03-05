// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  runtimeConfig: {
    apiSecret: '',
    apiBaseUrl: '',
    public: {
      demo: {
        maxChatMessages: '99999', // chatbot msg number per day -> overridden by app
      },
    },
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
