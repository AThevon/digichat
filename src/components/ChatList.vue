<script>
   import { defineComponent, ref, nextTick } from "vue";
   import { collection, onSnapshot } from "firebase/firestore";
   import { db } from "../../firebase";
   import ChatLine from "./ChatLine.vue";

   export default defineComponent({
      name: "ChatList",
      components: {
         ChatLine,
      },
      setup() {
         const chats = ref([]);
         const chatListRef = ref(null);

         const scrollToBottom = () => {
            nextTick(() => {
               const chatList = chatListRef.value;
               if (chatList) {
                  chatList.scrollTop = chatList.scrollHeight;
               }
            });
         };

         const colRef = collection(db, "chat");
         onSnapshot(colRef, (querySnapshot) => {
            chats.value = querySnapshot.docs.map((doc) => {
               const data = doc.data();
               return {
                  userName: {
                     firstName: data.user_first_name,
                     lastName: data.user_last_name,
                  },
                  userPhotoUrl: data.user_photo_url,
                  content: data.content,
                  created_at: data.created_at.toDate().toISOString(), // Convert Date to ISO string
               };
            });
            scrollToBottom();
         });

         return {
            chats,
            chatListRef,
            scrollToBottom,
         };
      },
      computed: {
         sortedChats() {
            return this.chats.sort(
               (a, b) => new Date(a.created_at) - new Date(b.created_at)
            );
         },
      },
   });
</script>

<template>
   <div ref="chatList">
      <ul
         ref="chatListRef"
         class="custom-scrollbar opacity-100 flex flex-col gap-1 w-full h-[55vh] overflow-auto px-1"
         :class="{
            'shadow-inner-top': chats.length > 4,
            'opacity-0': !chats.length,
         }"
      >
         <li
            v-for="chat in sortedChats"
            :key="chat.created_at"
            v-motion
            :initial="{ y: -100 }"
            :enter="{ y: 0 }"
            class="transition ease-out duration-200 w-full"
         >
            <ChatLine
               :userName="chat.userName"
               :userPhotoUrl="chat.userPhotoUrl"
               :content="chat.content"
               :created_at="chat.created_at"
            />
         </li>
      </ul>
   </div>
</template>
