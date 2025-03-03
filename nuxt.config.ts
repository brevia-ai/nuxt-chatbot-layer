// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  runtimeConfig: {
    apiSecret: '',
    apiBaseUrl: '',
    // multi-project configuration
    projects: {},
    public: {
      integration: 'brevia', // possibile values: brevia, bedita
      demo: {
        maxChatMessages: '99999', // chatbot msg number per day -> overridden by app
      },
    },
    // brevia integration session & auth credentials
    brevia: {
      session: {
        name: '',
        secret: '',
      },
    }
  },
  devtools: { enabled: process.env?.DEVTOOLS === 'true' ? true : false },
  imports: {
    autoImport: true,
    dirs: ['server'],
  },
  modules: ['@nuxtjs/tailwindcss', '@nuxt/eslint', 'nuxt-icon'],
  $meta: {
    name: 'nuxt-chatbot-layer'
  }
});
