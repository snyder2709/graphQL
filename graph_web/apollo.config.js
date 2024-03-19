// apollo.config.js
module.exports = {
  client: {
    service: {
      name: "graph_serv",
      // URL to the GraphQL API
      url: process.env.VUE_APP_BASE_GRAPHQL,
    },
    // Files processed by the extension
    includes: ["src/**/*.vue", "src/**/*.js"],
  },
};
