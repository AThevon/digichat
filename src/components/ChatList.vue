<script>
   import { defineComponent } from "vue";
   import { auth, db } from "../../firebase";
   import { collection, onSnapshot } from "firebase/firestore";
   import ChatLine from "./ChatLine.vue";

   export default defineComponent({
      name: "ChatList",
      components: {
         ChatLine,
      },
      data() {
         return {
            chats: [],
         };
      },
      created() {
         const colRef = collection(db, "chat");
         onSnapshot(colRef, (querySnapshot) => {
            this.chats = querySnapshot.docs.map((doc) => {
               const data = doc.data();
               return {
                  author: data.userFirstName + " " + data.userLastName,
                  content: data.content,
                  created_at: data.created_at.toDate(),
               };
            });
         });
      },
      computed: {
         sortedChats() {
            return this.chats.sort((a, b) => {
               return new Date(a.created_at) - new Date(b.created_at);
            });
         },
      },
   });
</script>

<template>
   <ul>
      <ChatLine
         v-for="chat in sortedChats"
         :key="chat.created_at"
         :userName="chat.author"
         :content="chat.content"
         :created_at="chat.created_at"
      />
   </ul>
</template>
