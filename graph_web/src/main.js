import { createApp } from "vue";
import PrimeVue from "primevue/config";
import { DefaultApolloClient } from "@vue/apollo-composable";
import "./style.css";
import App from "./App.vue";
import VueApolloComponents from "@vue/apollo-components";
import { apolloClient } from "./apollo";
import ToastService from "primevue/toastservice";
import naive from "naive-ui";
import { loadErrorMessages, loadDevMessages } from "@apollo/client/dev";

if (process.env.NODE_ENV) {
  // Adds messages only in a dev environment
  loadDevMessages();
  loadErrorMessages();
}
createApp(App)
  .use(PrimeVue)
  .provide(DefaultApolloClient, apolloClient)
  .use(VueApolloComponents)
  .use(ToastService)
  .use(naive)
  .mount("#app");
