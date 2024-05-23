<script>
   import { defineComponent } from "vue";
   import { auth, db } from "../../firebase";
   import { addDoc, collection, getDoc, doc } from "firebase/firestore";

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

            const userDoc = await getDoc(doc(db, "users", user.uid));
            if (!userDoc.exists()) {
               console.error("User document not found");
               return;
            }
            const userData = userDoc.data();
            try {
               await addDoc(collection(db, "chat"), {
                  userFirstName: userData.first_name,
                  userLastName: userData.last_name,
                  content: this.message,
                  created_at: new Date(),
                  userId: user.uid,
               });
               this.message = "";
            } catch (error) {
               console.error("Error adding message: ", error);
            }
         },
      },
   });
</script>

<template>
   <form @submit.prevent="sendMessage">
      <input
         type="text"
         v-model="message"
         placeholder="Type your message here..."
      />
      <button type="submit">Send</button>
   </form>
</template>
