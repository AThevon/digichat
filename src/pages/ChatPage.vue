<script>
   import ChatList from "@/components/ChatList.vue";
   import ChatForm from "@/components/ChatForm.vue";
   import { auth, db } from "../../firebase";
   import { onAuthStateChanged } from "firebase/auth";
   import { doc, getDoc } from "firebase/firestore";
   import ChatStats from "@/components/ChatStats.vue";

   export default {
      name: "Chat",
      components: {
         ChatList,
         ChatForm,
         ChatStats,
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
   <h2 v-if="user.firstName" class="text-center text-2xl mb-10 font-bold">
      Welcome, {{ user.firstName }} !
   </h2>
   <h2 v-else class="text-center text-2xl font-bold">Welcome !</h2>
   <section class="grid grid-cols-[3fr_2fr] gap-4 px-20 max-w-[80rem] mx-auto">
      <div class="flex flex-col w-full">
         <ChatList :currentUser="user" />
         <ChatForm />
      </div>
      <ChatStats />
   </section>
</template>
