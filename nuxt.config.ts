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
    //chatbot configuration
    public: {
      maxMessages: '100',
      startMessage: '',
      exampleQuestions: [],
      chatActions: 'true',
    },
  },
  devtools: { enabled: process.env?.DEVTOOLS === 'true' ? true : false },
  imports: {
    autoImport: true,
  },
  modules: [
    '@nuxtjs/tailwindcss',
    'nuxt-icon'
  ],
})
