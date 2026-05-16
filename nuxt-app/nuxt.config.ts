export default defineNuxtConfig({
  devServer: {
    host: '0.0.0.0',
  },
  modules: ['@nuxtjs/apollo'],
  apollo: {
    clients: {
      default: {
        httpEndpoint: 'http://localhost:8080/v1/graphql',
      }
    }
  },
  runtimeConfig: {
    jwtSecret: 'hasura-practice-local-secret-key-min32chars!!',
    hasuraAdminSecret: 'hasura-admin-secret',
    hasuraEndpoint: 'http://localhost:8080/v1/graphql',
  }
})
