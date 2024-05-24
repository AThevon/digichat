<script>
   import { auth } from "../../firebase";
   import { signInWithEmailAndPassword } from "firebase/auth";
   import LoaderCustom from "../components/LoaderCustom.vue";

   export default {
      components: {
         LoaderCustom,
      },
      data() {
         return {
            email: "",
            password: "",
            isLoading: false,
         };
      },
      methods: {
         async login() {
            this.isLoading = true;
            try {
               await signInWithEmailAndPassword(
                  auth,
                  this.email,
                  this.password
               );
               this.$router.push("/");
            } catch (error) {
               console.error(error);
            } finally {
               this.isLoading = false;
            }
         },
      },
   };
</script>

<template>
   <section class="flex flex-col w-full gap-4">
      <div class="flex flex-col items-center justify-center mb-8">
         <h1 class="font-bold text-3xl uppercase">DigiChat</h1>
         <img src="@/assets/logo.png" alt="Login" class="w-40 h-40 mx-auto" />
      </div>
      <h2
         class="text-neutral-100 text-center text-3xl font-bold font-sans uppercase"
      >
         Login
      </h2>
      <form
         class="flex flex-col w-full max-w-[20rem] mx-auto"
         @submit.prevent="login"
      >
         <label for="email" class="ml-2 mb-1 text-neutral-100"> Email </label>
         <input
            type="email"
            id="email"
            class="mb-4 p-2 rounded-lg bg-neutral-800 text-neutral-100 w-full focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-opacity-50"
            placeholder="johndoe@example.com"
            v-model="email"
         />
         <label for="password" class="ml-2 mb-1 text-neutral-100">
            Password
         </label>
         <input
            type="password"
            id="password"
            class="mb-4 p-2 rounded-lg bg-neutral-800 text-neutral-100 w-full focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-opacity-50"
            placeholder="*******"
            v-model="password"
         />
         <button
            type="submit"
            class="bg-primary-500 text-neutral-100 p-2 rounded-md transition-all font-sans hover:bg-primary-600 active:scale-[0.98]"
            :class="{
               'cursor-not-allowed !bg-neutral-600': !email || !password,
            }"
            :disabled="!email || !password || isLoading"
         >
            Login
         </button>
      </form>
      <RouterLink
         to="/sign-up"
         class="text-primary-500 text-center transition-all hover:text-neutral-200"
      >
         Don't have an account? Sign Up
      </RouterLink>
      <LoaderCustom v-if="isLoading" />
   </section>
</template>
