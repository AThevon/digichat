<script>
   import { defineComponent } from "vue";
   import {
      collection,
      onSnapshot,
      query,
      orderBy,
      limit,
   } from "firebase/firestore";
   import { db } from "../../firebase";

   export default defineComponent({
      name: "ChatStats",
      data() {
         return {
            totalMessages: 0,
            totalUsers: 0,
            bestChatters: [],
            totalParticipants: 0,
         };
      },
      async created() {
         await this.fetchChatStats();
      },
      methods: {
         fetchChatStats() {
            try {
               const chatColRef = collection(db, "chat");
               onSnapshot(chatColRef, (chatSnapshot) => {
                  const uniqueUsers = new Set();
                  this.totalMessages = chatSnapshot.size;
                  chatSnapshot.forEach((doc) => {
                     const data = doc.data();
                     if (data.user_id) {
                        uniqueUsers.add(data.user_id);
                     }
                  });
                  this.totalParticipants = uniqueUsers.size;
               });

               const bestChattersQuery = query(
                  collection(db, "users"),
                  orderBy("message_count", "desc"),
                  limit(5)
               );
               onSnapshot(bestChattersQuery, (bestChattersSnapshot) => {
                  this.bestChatters = bestChattersSnapshot.docs.map((doc) =>
                     doc.data()
                  );
               });
            } catch (error) {
               console.error("Error fetching chat stats: ", error);
            }
         },
      },
   });
</script>

<template>
   <div
      class="flex flex-col gap-4 p-4 bg-neutral-800 rounded-2xl shadow-md w-full"
   >
      <h2 class="text-neutral-200 text-center uppercase font-bold">
         Chat Stats
      </h2>
      <div class="flex justify-center items-center gap-2 mt-4">
         <p class="text-neutral-400">Messages:</p>
         <p class="text-neutral-200">{{ totalMessages }}</p>
      </div>
      <div class="flex justify-center items-center gap-2">
         <p class="text-neutral-400">Participants:</p>
         <p class="text-neutral-200">{{ totalParticipants }}</p>
      </div>
      <div class="mt-10">
         <p class="text-neutral-200 text-center font-bold">Top Chatters</p>
         <ul class="flex flex-col gap-2 mt-4 px-6">
            <li
               v-for="(chatter, index) in bestChatters"
               :key="chatter.uid"
               class="relative text-neutral-200 text-center bg-neutral-700 font-medium p-2 flex items-center justify-center gap-2 rounded-lg"
               :class="{
                  '!bg-primary-500 flex-col': index === 0,
               }"
            >
               <img
                  v-if="index === 0"
                  src="@/assets/crown.png"
                  alt="Crown"
                  class="absolute -top-3 left-[49%] -translate-x-1/2 -rotate-6 w-7 h-7"
               />
               <img
                  :src="chatter.photo_url"
                  alt="User Photo"
                  class="w-7 h-7 rounded-full object-cover"
                  :class="{
                     '!w-12 !h-12': index === 0,
                  }"
               />
               <p>
                  {{ chatter.first_name }}:
                  <span class="font-bold"> {{ chatter.message_count }}</span>
               </p>
            </li>
         </ul>
      </div>
   </div>
</template>
