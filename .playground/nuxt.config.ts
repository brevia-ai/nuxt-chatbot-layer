import { fileURLToPath } from 'node:url';

export default defineNuxtConfig({
  extends: ['..'],
  modules: ['@nuxt/eslint'],
  runtimeConfig: {
    public: {
      collectionUuid: '',
    },
  },
  eslint: {
    config: {
      // Use the generated ESLint config for lint root project as well
      rootDir: fileURLToPath(new URL('..', import.meta.url)),
    },
  },
  compatibilityDate: '2025-01-07',
});
