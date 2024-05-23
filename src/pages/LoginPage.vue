<script>
   import { auth } from "../../firebase";
   import { signInWithEmailAndPassword } from "firebase/auth";

   export default {
      data() {
         return {
            email: "",
            password: "",
         };
      },
      methods: {
         async login() {
            try {
               await signInWithEmailAndPassword(
                  auth,
                  this.email,
                  this.password
               );
               this.$router.push("/");
            } catch (error) {
               console.error(error);
            }
         },
      },
   };
</script>

<template>
   <section class="flex flex-col w-full gap-4">
      <h2
         class="text-neutral-100 text-center text-3xl font-bold uppercase mb-12"
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
            class="mb-4 p-2 rounded-lg bg-neutral-800 text-neutral-100 w-full"
            placeholder="johndoe@example.com"
            v-model="email"
         />
         <label for="password" class="ml-2 mb-1 text-neutral-100">
            Password
         </label>
         <input
            type="password"
            id="password"
            class="mb-4 p-2 rounded-lg bg-neutral-800 text-neutral-100 w-full"
            placeholder="*******"
            v-model="password"
         />
         <button
            type="submit"
            class="bg-primary-500 text-neutral-100 p-2 rounded-md transition-all hover:bg-primary-600 active:scale-[0.98]"
            :class="{
               'cursor-not-allowed !bg-neutral-600': !email || !password,
            }"
            :disabled="!email || !password"
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
   </section>
</template>
