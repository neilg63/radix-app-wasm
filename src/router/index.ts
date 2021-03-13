import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";
import Console from "../components/Console.vue";

const routes: Array<RouteRecordRaw> = [
  {
    path: "/",
    name: "Console",
    component: Console,
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
