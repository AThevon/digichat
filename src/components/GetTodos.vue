<script>
   import { defineComponent } from "vue";
   import { db } from "../../firebase";
   import {
      collection,
      doc,
      onSnapshot,
      deleteDoc,
      updateDoc,
   } from "firebase/firestore";
   import {
      XMarkIcon,
      BackspaceIcon,
      PencilSquareIcon,
   } from "@heroicons/vue/24/solid";

   export default defineComponent({
      components: {
         XMarkIcon,
         BackspaceIcon,
         PencilSquareIcon,
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
         async toggleTask(id) {
            try {
               const task = this.items.find((item) => item.id === id);
               if (!task) throw new Error("Task not found");

               let updatedSubTasks = [];
               if (task.done) {
                  updatedSubTasks = task.subTasks.map((subTask) => ({
                     ...subTask,
                     done: false,
                  }));
               } else {
                  updatedSubTasks = task.subTasks.map((subTask) => ({
                     ...subTask,
                     done: true,
                  }));
               }

               const docRef = doc(db, "to_do", id);
               await updateDoc(docRef, {
                  done: !task.done,
                  sub_tasks: updatedSubTasks,
               });
            } catch (e) {
               console.error("Error updating document: ", e);
            }
         },
         async modifyTaskLabel(id) {
            try {
               const task = this.items.find((item) => item.id === id);
               if (!task) throw new Error("Task not found");

               const newLabel = prompt("Enter new label", task.label);
               if (newLabel === null || newLabel.trim() === "") return;

               const docRef = doc(db, "to_do", id);
               await updateDoc(docRef, {
                  label: newLabel,
               });
            } catch (e) {
               console.error("Error updating document: ", e);
            }
         },
         async modifyTaskDescription(id) {
            try {
               const task = this.items.find((item) => item.id === id);
               if (!task) throw new Error("Task not found");

               const newDescription = prompt(
                  "Enter new description",
                  task.description
               );
               if (newDescription === null) return;

               const docRef = doc(db, "to_do", id);
               await updateDoc(docRef, {
                  description: newDescription,
               });
            } catch (e) {
               console.error("Error updating document: ", e);
            }
         },
         async toggleSubtask(id, index) {
            try {
               const item = this.items.find((item) => item.id === id);
               if (!item) {
                  throw new Error("Item not found");
               }
               const updatedSubTasks = item.subTasks.map((subTask, i) => {
                  if (i === index) {
                     return {
                        ...subTask,
                        done: !subTask.done,
                     };
                  }
                  return subTask;
               });
               const docRef = doc(db, "to_do", id);
               await updateDoc(docRef, {
                  sub_tasks: updatedSubTasks,
               });
            } catch (e) {
               console.error("Error updating document: ", e);
            }
         },
         async modifySubtask(id, index) {
            try {
               const item = this.items.find((item) => item.id === id);
               if (!item) {
                  throw new Error("Item not found");
               }
               const updatedSubTasks = item.subTasks.map((subTask, i) => {
                  if (i === index) {
                     const newLabel = prompt("Enter new label", subTask.label);
                     if (newLabel === null || newLabel.trim() === "") {
                        return subTask;
                     }
                     return {
                        ...subTask,
                        label: newLabel,
                     };
                  }
                  return subTask;
               });
               const docRef = doc(db, "to_do", id);
               await updateDoc(docRef, {
                  sub_tasks: updatedSubTasks,
               });
            } catch (e) {
               console.error("Error updating document: ", e);
            }
         },
         async removeSubtask(id, index) {
            try {
               const item = this.items.find((item) => item.id === id);
               if (!item) {
                  throw new Error("Item not found");
               }
               const updatedSubTasks = item.subTasks.filter(
                  (_, i) => i !== index
               );
               const docRef = doc(db, "to_do", id);
               await updateDoc(docRef, {
                  sub_tasks: updatedSubTasks,
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
         class="group/task relative rounded-xl pt-4 pb-8 px-6 bg-neutral-800 text-neutral-200 z-20 transition-all cursor-pointer overflow-hidden"
         :class="{
            '!bg-green-700 line-through decoration-neutral-800': item.done,
         }"
         @click.stop="toggleTask(item.id)"
      >
         <div
            class="absolute left-0 -bottom-3 transition-all duration-300 ease-out -rotate-1 translate-y-2 group-hover/task:translate-y-0 w-full h-5"
            :class="{
               'bg-red-500': item.importance === 'high',
               'bg-yellow-500': item.importance === 'medium',
               'bg-green-500': item.importance === 'low',
            }"
         />
         <h2
            class="group/label w-fit flex items-center font-bold uppercase select-none"
         >
            {{ item.label }}
            <PencilSquareIcon
               class="hidden group-hover/label:block ml-1 size-4 text-neutral-700 transition-all hover:text-neutral-200"
               @click.stop="modifyTaskLabel(item.id)"
            />
         </h2>
         <p
            class="group/description relative w-fit flex px-4 items-center text-neutral-400"
         >
            {{ item.description }}
            <PencilSquareIcon
               class="hidden group-hover/description:block absolute top-1/2 -translate-y-1/2 -right-1 size-4 text-neutral-700 transition-all hover:text-neutral-200"
               @click.stop="modifyTaskDescription(item.id)"
            />
         </p>
         <ul v-if="item.subTasks.length" class="px-4 mt-2 flex flex-col gap-2">
            <li
               v-for="(subTask, index) in item.subTasks"
               :key="index"
               class="group/subtask flex items-center justify-between bg-neutral-300 text-neutral-600 p-2 rounded-md z-10 transition-all hover:bg-neutral-200 active:scale-[0.98] cursor-pointer select-none"
               :class="{
                  '!bg-green-600 line-through decoration-neutral-800':
                     subTask.done,
                  'pointer-events-none': item.done,
               }"
               @click.stop="toggleSubtask(item.id, index)"
            >
               {{ subTask.label }}
               <PencilSquareIcon
                  class="hidden group-hover/subtask:block ml-auto mr-1 size-5 text-neutral-700 transition-all hover:text-neutral-500"
                  @click.stop="modifySubtask(item.id, index)"
               />
               <BackspaceIcon
                  @click.stop="removeSubtask(item.id, index)"
                  class="hidden group-hover/subtask:block size-5 text-neutral-700 transition-all hover:text-red-600"
               />
            </li>
         </ul>
         <button
            @click.stop="removeItem(item.id)"
            class="absolute top-2 right-2"
         >
            <XMarkIcon
               class="hidden group-hover/task:block size-6 text-neutral-700 transition-all hover:text-neutral-200"
            />
         </button>
      </li>
   </ul>
</template>../firebase
