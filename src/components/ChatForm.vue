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
            lastMessageTimestamp: 0,
            timer: 0,
            timerInterval: null,
         };
      },
      methods: {
         async sendMessage() {
            const currentTimestamp = Date.now();
            const minTimeBetweenMessages = 5000; // 5 seconds

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
                  const lastMessageTime = userData.last_message_time
                     ? userData.last_message_time.toDate()
                     : new Date(0);
                  const currentTime = new Date();
                  const timeDiff = currentTime - lastMessageTime;

                  let consecutiveMessages = userData.consecutive_messages || 0;

                  if (timeDiff < minTimeBetweenMessages) {
                     consecutiveMessages += 1;
                  } else {
                     consecutiveMessages = 0;
                  }

                  if (consecutiveMessages >= 3) {
                     this.startTimer(minTimeBetweenMessages / 1000);
                     throw "You must wait 5 seconds between messages.";
                  }

                  const newMessageCount = (userData.message_count || 0) + 1;
                  transaction.update(userRef, {
                     message_count: newMessageCount,
                     last_message_time: serverTimestamp(),
                     consecutive_messages: consecutiveMessages, // mise à jour du compteur de messages consécutifs
                  });

                  const newMessageRef = doc(collection(db, "chat"));

                  transaction.set(newMessageRef, {
                     user_first_name: userData.first_name,
                     user_last_name: userData.last_name,
                     user_photo_url: userData.photo_url,
                     content: this.message,
                     created_at: serverTimestamp(),
                     user_id: user.uid,
                  });
               });

               this.message = "";
               this.lastMessageTimestamp = currentTimestamp;
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
         startTimer(seconds) {
            if (this.timerInterval) {
               clearInterval(this.timerInterval);
            }
            this.timer = seconds;
            this.timerInterval = setInterval(() => {
               if (this.timer > 0) {
                  this.timer--;
               } else {
                  clearInterval(this.timerInterval);
               }
            }, 1000);
         },
      },
      beforeUnmount() {
         if (this.timerInterval) {
            clearInterval(this.timerInterval);
         }
      },
   });
</script>

<template>
   <form
      @submit.prevent="sendMessage"
      class="flex flex-col w-full mt-5 xl:mt-1 px-3"
   >
      <textarea
         v-model="message"
         placeholder="Type your message here..."
         class="w-full p-4 bg-neutral-900 rounded-t-2xl shadow-md transition-all resize-none outline-none active:outline-none focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-opacity-50"
         @keydown="handleKeyDown"
      />
      <button
         type="submit"
         class="w-full p-4 text-white bg-primary-500 rounded-b-2xl shadow-md transition-all disabled:hover:bg-primary-600 active:scale-[0.98]"
         :class="{
            'cursor-not-allowed hover:bg-neutral-500':
               message.trim() === '' || timer > 0,
            '!bg-neutral-800': timer > 0,
         }"
      >
         <p v-if="timer === 0" class="text-center">Send</p>
         <p v-else class="text-center text-red-500">
            You can send a new message in {{ timer }} seconds
         </p>
      </button>
   </form>
</template>
