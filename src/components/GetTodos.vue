<script>
   import { defineComponent } from "vue";
   import { db } from "../../firebase";
   import {
      collection,
      doc,
      onSnapshot,
      deleteDoc,
      updateDoc,
      arrayRemove,
   } from "firebase/firestore";
   import { XMarkIcon } from "@heroicons/vue/24/solid";

   export default defineComponent({
      components: {
         XMarkIcon,
      },
      data() {
         return {
            items: [],
         };
      },
      computed: {
         getItems() {
            return this.items.sort((a, b) => {
               if (a.importance === b.importance) {
                  return a.created_at - b.created_at;
               }
               return a.importance === "high" ? -1 : 1;
            });
         },
      },
      methods: {
         async removeItem(id) {
            try {
               await deleteDoc(doc(db, "to_do", id));
            } catch (e) {
               console.error("Error deleting document: ", e);
            }
         },
         async taskDone(id) {
            try {
               const docRef = doc(db, "to_do", id);
               await updateDoc(docRef, {
                  done: true,
               });
            } catch (e) {
               console.error("Error updating document: ", e);
            }
         },
         async taskUndone(id) {
            try {
               const docRef = doc(db, "to_do", id);
               await updateDoc(docRef, {
                  done: false,
               });
            } catch (e) {
               console.error("Error updating document: ", e);
            }
         },
         async subtaskDone(id, index) {
            try {
               const docRef = doc(db, "to_do", id);
               await updateDoc(docRef, {
                  sub_tasks: arrayRemove(this.items[id].subTasks[index]),
               });
            } catch (e) {
               console.error("Error updating document: ", e);
            }
         },
         async removeSubtask(id, index) {
            try {
               const docRef = doc(db, "to_do", id);
               await updateDoc(docRef, {
                  sub_tasks: arrayRemove(this.items[id].subTasks[index]),
               });
            } catch (e) {
               console.error("Error updating document: ", e);
            }
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
                  done: data.done || false,
                  created_at: data.created_at,
               };
            });
         });
      },
   });
</script>

<template>
   <ul class="flex flex-col gap-2 w-full">
      <li
         v-for="item in getItems"
         :key="item.id"
         class="relative rounded-xl p-4 bg-neutral-400 text-neutral-100"
         :class="{ 'bg-green-700': item.done }"
         @click="item.done ? taskUndone(item.id) : taskDone(item.id)"
      >
         <h2 class="font-bold uppercase">{{ item.label }}</h2>
         <p class="text-neutral-500">{{ item.description }}</p>
         <ul v-if="item.subTasks.length" class="px-4 mt-2 flex flex-col gap-2">
            <li
               v-for="(subTask, index) in item.subTasks"
               :key="index"
               class="bg-neutral-300 text-neutral-600 p-2 rounded-md z-10"
               @click.stop="subtaskDone(item.id, index)"
            >
               {{ subTask }}
            </li>
         </ul>
         <button
            @click.stop="removeItem(item.id)"
            class="absolute top-2 right-2"
         >
            <XMarkIcon
               class="size-6 text-neutral-200 transition-all hover:text-neutral-600"
            />
         </button>
      </li>
   </ul>
</template>
