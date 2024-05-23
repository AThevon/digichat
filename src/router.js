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

let isAuthChecked = false;

router.beforeEach((to, from, next) => {
   if (!isAuthChecked) {
      onAuthStateChanged(auth, (user) => {
         isAuthChecked = true;
         const requiresAuth = to.matched.some(
            (record) => record.meta.requiresAuth
         );
         if (requiresAuth && !user) {
            next("/login");
         } else {
            next();
         }
      });
   } else {
      const requiresAuth = to.matched.some(
         (record) => record.meta.requiresAuth
      );
      const currentUser = auth.currentUser;

      if (requiresAuth && !currentUser) {
         next("/login");
      } else {
         next();
      }
   }
});

export default router;
