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
   <h2 class="text-center text-2xl font-bold font-sans">
      {{ user.firstName ? `${user.firstName}'s chat` : "Loading..." }}
   </h2>
   <section
      class="grid xl:grid-cols-[3fr_2fr] gap-2 xl:px-20 max-w-[80rem] xl:min-h-[40rem] mt-10 mx-auto"
   >
      <div class="flex flex-col w-full">
         <ChatList :currentUser="user" />
         <ChatForm />
      </div>
      <ChatStats />
   </section>
</template>
