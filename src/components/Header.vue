<script>
   import { PowerIcon } from "@heroicons/vue/24/solid";
   import { auth } from "../../firebase";
   import { signOut, onAuthStateChanged } from "firebase/auth";

   export default {
      components: {
         PowerIcon,
      },
      data() {
         return {
            isAuthenticated: false,
            links: [
               {
                  name: "Chat",
                  path: "/",
                  requiresAuth: true,
               },
               {
                  name: "Todo",
                  path: "/todo",
                  requiresAuth: true,
               },
               {
                  name: "Login",
                  path: "/login",
                  requiresAuth: false,
               },
               {
                  name: "Sign Up",
                  path: "/sign-up",
                  requiresAuth: false,
               },
            ],
         };
      },
      computed: {
         filteredLinks() {
            return this.links.filter(
               (link) => link.requiresAuth === this.isAuthenticated
            );
         },
      },
      methods: {
         async logout() {
            this.$router.push("/login");
            await signOut(auth);
            this.isAuthenticated = false;
         },
      },
      created() {
         onAuthStateChanged(auth, (user) => {
            this.isAuthenticated = !!user;
         });
      },
   };
</script>

<template>
   <header
      class="fixed text-neutral-100 h-14 w-full flex items-center justify-between px-8"
   >
      <h1 class="text-2xl font-bold">DigiChat</h1>
      <nav>
         <ul class="flex gap-4">
            <li v-for="link in filteredLinks" :key="link.name">
               <RouterLink
                  :to="link.path"
                  class="hover:text-primary-500 transition-all"
                  active-class="text-primary-500 cursor-default"
               >
                  {{ link.name }}
               </RouterLink>
            </li>
            <li v-if="this.isAuthenticated">
               <button
                  @click="logout"
                  class="group h-6 w-6 bg-neutral-100 rounded-full flex justify-center items-center"
               >
                  <PowerIcon
                     class="size-4 text-neutral-800 group-hover:text-red-400 transition-all"
                  />
               </button>
            </li>
         </ul>
      </nav>
   </header>
</template>
