<script>
   import ChatList from "@/components/ChatList.vue";
   import ChatForm from "@/components/ChatForm.vue";
   import { auth, db } from "../../firebase";
   import { onAuthStateChanged } from "firebase/auth";
   import { doc, getDoc } from "firebase/firestore";

   export default {
      name: "Chat",
      components: {
         ChatList,
         ChatForm,
      },
      data() {
         return {
            title: "",
            user: {
               id: "",
               firstName: "",
               lastName: "",
               email: "",
            },
         };
      },
      created() {
         this.fetchUserData();
      },
      methods: {
         async fetchUserData() {
            onAuthStateChanged(auth, async (user) => {
               if (user) {
                  const userDoc = await getDoc(doc(db, "users", user.uid));
                  if (userDoc.exists()) {
                     const userData = userDoc.data();
                     this.user = {
                        id: user.uid,
                        firstName: userData.first_name,
                        lastName: userData.last_name,
                        email: userData.email,
                     };
                  } else {
                     console.log("No such document!");
                  }
               }
            });
         },
      },
   };
</script>

<template>
   <section class="flex flex-col w-full">
      <h2 v-if="user" class="text-center text-2xl font-bold">
         Welcome, {{ user.firstName }} !
      </h2>
      <h2 v-else class="text-center text-2xl font-bold">Welcome !</h2>
      <ChatList :currentUser="user" />
      <ChatForm />
   </section>
</template>
