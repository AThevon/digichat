<script>
   import { defineComponent } from "vue";
   import { auth, db } from "../../firebase";
   import {
      doc,
      runTransaction,
      collection,
      serverTimestamp,
   } from "firebase/firestore";

   export default defineComponent({
      name: "ChatForm",
      data() {
         return {
            message: "",
         };
      },
      methods: {
         async sendMessage() {
            if (this.message.trim() === "") return;

            const user = auth.currentUser;
            if (!user) {
               console.error("No user is authenticated");
               return;
            }

            const userRef = doc(db, "users", user.uid);

            try {
               await runTransaction(db, async (transaction) => {
                  const userDoc = await transaction.get(userRef);
                  if (!userDoc.exists()) {
                     throw "User document not found";
                  }

                  const userData = userDoc.data();

                  const newMessageCount = (userData.message_count || 0) + 1;
                  transaction.update(userRef, {
                     message_count: newMessageCount,
                  });

                  const newMessageRef = doc(collection(db, "chat"));

                  transaction.set(newMessageRef, {
                     user_first_name: userData.first_name,
                     user_last_name: userData.last_name,
                     content: this.message,
                     created_at: serverTimestamp(),
                     user_id: user.uid,
                  });
               });

               this.message = "";
            } catch (error) {
               console.error("Error adding message: ", error);
            }
         },
         handleKeyDown(event) {
            if (event.key === "Enter" && !event.shiftKey) {
               event.preventDefault();
               this.sendMessage();
            }
         },
      },
   });
</script>

<template>
   <form
      @submit.prevent="sendMessage"
      class="flex flex-col w-full mt-5"
   >
      <textarea
         v-model="message"
         placeholder="Type your message here..."
         class="w-full p-4 bg-neutral-900 rounded-t-2xl shadow-md transition-all resize-none outline-none active:outline-none focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-opacity-50"
         @keydown="handleKeyDown"
      />
      <button
         type="submit"
         class="w-full p-4 text-white bg-primary-500 rounded-b-2xl shadow-md transition-all disabled-hover:bg-primary-600 active:scale-[0.98]"
         :class="{
            'cursor-not-allowed bg-neutral-500 hover:bg-neutral-500':
               message.trim() === '',
         }"
      >
         Send
      </button>
   </form>
</template>
