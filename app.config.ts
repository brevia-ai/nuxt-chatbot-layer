export default defineAppConfig({
  myLayer: {
    name: 'Prova'
  }
})

declare module '@nuxt/schema' {
  interface AppConfigInput {
    myLayer?: {
      /** Project name */
      name?: string
    }
  }
}
