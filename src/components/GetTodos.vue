<script>
   import { db } from "../../firebase";
   import { collection, onSnapshot } from "firebase/firestore";

   export default {
      data() {
         return {
            items: [],
         };
      },
      computed: {
         getItems() {
            return this.items;
         },
      },
      created() {
         const colRef = collection(db, "to_do");
         onSnapshot(colRef, (querySnapshot) => {
            this.items = querySnapshot.docs.map((doc) => ({
               id: doc.id,
               label: doc.data().label,
               description: doc.data().description,
            }));
         });
      },
   };
</script>

<template>
   <ul class="flex flex-col gap-2 w-full">
      <li
         v-for="item in items"
         :key="item.id"
         class="rounded-xl p-4 bg-neutral-400 text-neutral-100"
      >
         <h2 class="font-bold uppercase">{{ item.label }}</h2>
         <p class="text-neutral-500">{{ item.description }}</p>
      </li>
   </ul>
</template>
