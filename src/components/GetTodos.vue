<script>
   import { defineComponent } from "vue";
   import { db } from "../../firebase";
   import { collection, onSnapshot } from "firebase/firestore";

   export default defineComponent({
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
            this.items = querySnapshot.docs.map((doc) => {
               const data = doc.data();
               return {
                  id: doc.id,
                  label: data.label,
                  description: data.description,
                  subTasks: data.sub_tasks || [],
                  importance: data.importance || "low",
               };
            });
         });
      },
   });
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
         <ul v-if="item.subTasks.length" class="px-4 mt-2 flex flex-col gap-2">
            <li
               v-for="(subTask, index) in item.subTasks"
               :key="index"
               class="bg-neutral-300 text-neutral-600 p-2 rounded-md"
            >
               {{ subTask }}
            </li>
         </ul>
      </li>
   </ul>
</template>
