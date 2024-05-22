<script>
   import { defineComponent } from "vue";
   import { db } from "../../firebase";
   import { collection, addDoc } from "firebase/firestore";
   import { ArrowLongRightIcon, BackspaceIcon } from "@heroicons/vue/24/solid";

   export default defineComponent({
      components: {
         BackspaceIcon,
         ArrowLongRightIcon,
      },
      data() {
         return {
            todo: {
               label: "",
               description: "",
               importance: "low",
               subTasks: [],
            },
            newSubTask: "",
         };
      },
      methods: {
         async addTodo() {
            try {
               const docRef = await addDoc(collection(db, "to_do"), {
                  label: this.todo.label,
                  description: this.todo.description,
                  importance: this.todo.importance,
                  sub_tasks: this.todo.subTasks,
               });
               console.log("Document written with ID: ", docRef.id);
               this.todo.label = "";
               this.todo.description = "";
               this.todo.importance = "low";
               this.todo.subTasks = [];
               this.newSubTask = "";
            } catch (e) {
               console.error("Error adding document: ", e);
            }
         },
         addSubTask() {
            if (this.newSubTask) {
               this.todo.subTasks.push(this.newSubTask);
               this.newSubTask = "";
            }
         },
         removeSubTask(index) {
            this.todo.subTasks.splice(index, 1);
         },
      },
   });
</script>

<template>
   <form
      @submit.prevent="addTodo"
      class="flex flex-col gap-2 w-full max-w-[30rem]"
   >
      <label for="label" class="text-neutral-100">Title</label>
      <input
         v-model="todo.label"
         id="label"
         placeholder="Enter a title"
         class="text-neutral-800 rounded p-2"
      />
      <label for="description" class="text-neutral-100">Description</label>
      <input
         v-model="todo.description"
         id="description"
         placeholder="Enter a description"
         class="text-neutral-800 rounded p-2"
      />
      <label for="importance" class="text-neutral-100">Importance</label>
      <div class="grid grid-cols-3 gap-2">
         <label
            class="flex items-center justify-center cursor-pointer rounded-2xl h-12"
            :class="{
               'bg-blue-500 text-white': todo.importance === 'low',
               'bg-neutral-200 text-neutral-800': todo.importance !== 'low',
            }"
         >
            <input
               type="radio"
               v-model="todo.importance"
               value="low"
               class="hidden"
            />
            <span
               class="flex px-4 py-2 text-center rounded-md transition-all duration-150"
               >Low
            </span>
         </label>
         <label
            class="flex items-center cursor-pointer"
            :class="{
               'bg-blue-500 text-white': todo.importance === 'medium',
               'bg-neutral-200 text-neutral-800': todo.importance !== 'medium',
            }"
         >
            <input
               type="radio"
               v-model="todo.importance"
               value="medium"
               class="hidden"
            />
            <span class="px-4 py-2 rounded-md transition-all duration-150"
               >Medium</span
            >
         </label>
         <label
            class="flex items-center cursor-pointer"
            :class="{
               'bg-blue-500 text-white': todo.importance === 'high',
               'bg-neutral-200 text-neutral-800': todo.importance !== 'high',
            }"
         >
            <input
               type="radio"
               v-model="todo.importance"
               value="high"
               class="hidden"
            />
            <span class="px-4 py-2 rounded-md transition-all duration-150"
               >High</span
            >
         </label>
      </div>

      <label for="subtask" class="text-neutral-100">Subtasks</label>
      <input
         v-model="newSubTask"
         id="subtask"
         placeholder="Add a subtask"
         class="text-neutral-800 rounded p-2"
      />
      <button
         type="button"
         @click="addSubTask"
         class="rounded bg-neutral-600 text-neutral-100 uppercase font-normal py-2 px-4 transition-all duration-150 hover:bg-neutral-700 active:scale-95"
      >
         Add Subtask
      </button>

      <ul class="mt-2">
         <li
            v-for="(subTask, index) in todo.subTasks"
            :key="index"
            class="flex justify-between items-center bg-neutral-300 text-neutral-700 p-2 rounded-md mb-1"
         >
            {{ subTask }}
            <button
               type="button"
               @click="removeSubTask(index)"
               class="text-red-500 transition-all duration-150 hover:scale-110"
            >
               <BackspaceIcon class="size-6 text-red-500" />
            </button>
         </li>
      </ul>

      <button
         class="flex items-center justify-center rounded bg-neutral-600 text-neutral-100 uppercase font-normal py-3 px-6 transition-all duration-150 hover:bg-neutral-700 active:scale-95 mt-4"
      >
         <span class="relative max-w-fit">
            Add Todo
            <ArrowLongRightIcon
               class="absolute left-[110%] top-1/2 -translate-y-1/2 size-6 text-neutral-100"
            />
         </span>
      </button>
   </form>
</template>
