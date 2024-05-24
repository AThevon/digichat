import { createRouter, createWebHistory } from "vue-router";
import ChatPage from "@/pages/ChatPage.vue";
import TodoPage from "@/pages/TodoPage.vue";
import LoginPage from "@/pages/LoginPage.vue";
import SignUpPage from "@/pages/SignUpPage.vue";
import { auth } from "../firebase";
import { onAuthStateChanged } from "firebase/auth";

const routes = [
   {
      path: "/",
      name: "Chat",
      component: ChatPage,
      meta: { requiresAuth: true },
   },
   {
      path: "/todo",
      name: "ToDo",
      component: TodoPage,
      meta: { requiresAuth: true },
   },
   {
      path: "/login",
      name: "Login",
      component: LoginPage,
   },
   {
      path: "/sign-up",
      name: "SignUp",
      component: SignUpPage,
   },
   {
      path: "/:pathMatch(.*)*",
      redirect: "/",
   },
];

const router = createRouter({
   history: createWebHistory(import.meta.env.BASE_URL),
   routes,
});

router.beforeEach((to, from, next) => {
   const requiresAuth = to.matched.some((record) => record.meta.requiresAuth);

   if (requiresAuth) {
      // Delay navigation until the authentication state is checked
      onAuthStateChanged(auth, (user) => {
         if (user) {
            next();
         } else {
            next("/login");
         }
      });
   } else {
      next();
   }
});

export default router;
