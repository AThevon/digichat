<script>
   import { PowerIcon } from "@heroicons/vue/24/solid";
   import { auth, db } from "../../firebase";
   import { signOut, onAuthStateChanged } from "firebase/auth";
   import { doc, getDoc } from "firebase/firestore";

   export default {
      components: {
         PowerIcon,
      },
      data() {
         return {
            isAuthenticated: false,
            photoURL: "",
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
            await signOut(auth);
            this.$router.push("/login");
            this.isAuthenticated = false;
         },
         async fetchUserProfilePhoto(userId) {
            const userDoc = await getDoc(doc(db, "users", userId));
            if (userDoc.exists()) {
               const userData = userDoc.data();
               this.photoURL = userData.photo_url;
            } else {
               console.error("User document not found");
            }
         },
      },
      created() {
         onAuthStateChanged(auth, (user) => {
            if (user) {
               console.log("User is authenticated");
               this.isAuthenticated = true;
               this.fetchUserProfilePhoto(user.uid);
            } else {
               console.log("No user is authenticated");
               this.isAuthenticated = false;
            }
         });
      },
   };
</script>

<template>
   <header
      class="fixed text-neutral-100 h-20 w-full flex items-center justify-between px-8"
   >
      <h1 class="hidden text-2xl font-bold font-secondary">DigiChat</h1>
      <img
         src="@/assets/logo.png"
         alt="DigiChat Logo"
         class="h-12 w-12 object-contain rounded-lg"
      />
      <nav>
         <ul class="flex gap-4 items-center">
            <li v-for="link in filteredLinks" :key="link.name">
               <RouterLink
                  :to="link.path"
                  class="text-primary-400 hover:text-primary-500 transition-all"
                  active-class="!text-primary-100 cursor-default"
               >
                  {{ link.name }}
               </RouterLink>
            </li>
            <li v-if="isAuthenticated" class="flex items-center gap-2">
               <img
                  v-if="photoURL"
                  :src="photoURL"
                  alt="User Photo"
                  class="w-10 h-10 rounded-full object-contain"
                  @click="updatePhoto"
               />
               <button
                  @click="logout"
                  class="group h-10 w-10 bg-neutral-100 hover:bg-red-500 transition-all rounded-full flex justify-center items-center"
               >
                  <PowerIcon
                     class="size-4 text-neutral-800 group-hover:text-neutral-50 transition-all"
                  />
               </button>
            </li>
         </ul>
      </nav>
   </header>
</template>
