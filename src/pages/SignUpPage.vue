<script>
   import { auth } from "../../firebase";
   import { createUserWithEmailAndPassword } from "firebase/auth";
   import { db } from "../../firebase";
   import { setDoc, doc } from "firebase/firestore";

   export default {
      data() {
         return {
            firstName: "",
            lastName: "",
            email: "",
            password: "",
         };
      },
      methods: {
         async signUp() {
            try {
               const userCredential = await createUserWithEmailAndPassword(
                  auth,
                  this.email,
                  this.password
               );
               const user = userCredential.user;

               await setDoc(doc(db, "users", user.uid), {
                  first_name: this.firstName,
                  last_name: this.lastName,
                  email: this.email,
               });
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
         Sign Up
      </h2>
      <form
         class="flex flex-col w-full max-w-[20rem] mx-auto"
         @submit.prevent="signUp"
      >
         <label for="firstName" class="ml-2 mb-1 text-neutral-100">
            First Name
         </label>
         <input
            type="text"
            id="firstName"
            class="mb-4 p-2 rounded-lg bg-neutral-800 text-neutral-100 w-full"
            placeholder="John"
            v-model="firstName"
         />
         <label for="lastName" class="ml-2 mb-1 text-neutral-100">
            Last Name
         </label>
         <input
            type="text"
            id="lastName"
            class="mb-4 p-2 rounded-lg bg-neutral-800 text-neutral-100 w-full"
            placeholder="Doe"
            v-model="lastName"
         />
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
               'cursor-not-allowed !bg-neutral-600':
                  !firstName || !lastName || !email || !password,
            }"
            :disabled="!firstName || !lastName || !email || !password"
         >
            Sign Up
         </button>
      </form>
      <RouterLink
         to="/login"
         class="text-primary-500 text-center transition-all hover:text-neutral-200"
      >
         Already have an account? Login
      </RouterLink>
   </section>
</template>
