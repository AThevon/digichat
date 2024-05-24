<script>
   import { auth } from "../../firebase";
   import { createUserWithEmailAndPassword } from "firebase/auth";
   import { db } from "../../firebase";
   import { setDoc, doc } from "firebase/firestore";
   import {
      getStorage,
      ref as storageRef,
      uploadBytes,
      getDownloadURL,
   } from "firebase/storage";
   import { UserCircleIcon } from "@heroicons/vue/24/solid";

   export default {
      components: {
         UserCircleIcon,
      },
      data() {
         return {
            firstName: "",
            lastName: "",
            email: "",
            password: "",
            file: null,
            fileURL: null,
         };
      },
      methods: {
         onFileChange(event) {
            this.file = event.target.files[0];
            this.fileURL = URL.createObjectURL(this.file);
         },
         async signUp() {
            try {
               const userCredential = await createUserWithEmailAndPassword(
                  auth,
                  this.email,
                  this.password
               );
               const user = userCredential.user;

               let photoURL =
                  "https://firebasestorage.googleapis.com/v0/b/digichat-b82fd.appspot.com/o/profilePictures%2FUser%20Profile%20icon.svg?alt=media&token=26ce031e-1a34-401b-831a-b382f6257a4b";
               const storage = getStorage();
               if (this.file) {
                  const fileRef = storageRef(
                     storage,
                     `profilePictures/${user.uid}`
                  );
                  await uploadBytes(fileRef, this.file);
                  photoURL = await getDownloadURL(fileRef);
               }

               await setDoc(doc(db, "users", user.uid), {
                  first_name: this.firstName,
                  last_name: this.lastName,
                  email: this.email,
                  photo_url: photoURL,
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
         <label
            for="profilePhoto"
            class="group relative mb-7 mx-auto w-24 h-24 rounded-full bg-neutral-200 flex items-center justify-center cursor-pointer transition-all active:scale-[0.98] overflow-hidden"
         >
            <UserCircleIcon
               v-if="this.file === null"
               class="size-24 text-neutral-700"
            />
            <img
               v-else
               :src="fileURL"
               alt="Profile Photo"
               class="w-24 h-24 rounded-full object-cover"
            />
            <span
               class="absolute z-10 h-10 w-full text-center text-sm pt-2 top-full group-hover:top-[60%] left-1/2 -translate-x-1/2 bg-neutral-900 transition-all opacity-90"
            >Upload</span>
         </label>
         <input
            type="file"
            id="profilePhoto"
            @change="onFileChange"
            class="hidden"
         />
         <label for="firstName" class="ml-2 mb-1 text-neutral-100">
            First Name
         </label>
         <input
            type="text"
            id="firstName"
            class="mb-4 p-2 rounded-lg bg-neutral-800 text-neutral-100 w-full focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-opacity-50"
            placeholder="John"
            v-model="firstName"
         />
         <label for="lastName" class="ml-2 mb-1 text-neutral-100">
            Last Name
         </label>
         <input
            type="text"
            id="lastName"
            class="mb-4 p-2 rounded-lg bg-neutral-800 text-neutral-100 w-full focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-opacity-50"
            placeholder="Doe"
            v-model="lastName"
         />
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
