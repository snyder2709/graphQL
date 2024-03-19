import { createMemoryHistory, createRouter } from "vue-router";


const routes = [
  { path: "/", component: @ },
  { path: "/", component: AboutView },
];

const router = createRouter({
  history: createMemoryHistory(),
  routes,
});
