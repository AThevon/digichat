<script>
   import { defineComponent } from "vue";
   import { db } from "../../firebase";
   import { collection, addDoc } from "firebase/firestore";
   import { ArrowLongRightIcon, BackspaceIcon } from "@heroicons/vue/24/solid";
   import ButtonRadio from "./ButtonRadio.vue";

   export default defineComponent({
      components: {
         ButtonRadio,
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
               created_at: new Date(),
            },
            importances: ["low", "medium", "high"],
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
                  created_at: this.todo.created_at,
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
               this.todo.subTasks.push({
                  label: this.newSubTask,
                  done: false,
                  created_at: new Date(),
               });
               this.newSubTask = "";
            }
         },
         removeSubTask(index) {
            this.todo.subTasks.splice(index, 1);
         },
         updateImportance(newImportance) {
            this.todo.importance = newImportance;
         },
      },
   });
</script>

<template>
   <form
      @submit.prevent="addTodo"
      class="flex flex-col gap-2 w-full"
   >
      <label for="label" class="text-neutral-100">Title</label>
      <input
         v-model="todo.label"
         id="label"
         placeholder="Enter a title"
         class="text-neutral-200 bg-neutral-800 focus-visible:outline-none rounded-lg p-2"
      />
      <label for="description" class="text-neutral-100">Description</label>
      <input
         v-model="todo.description"
         id="description"
         placeholder="Enter a description"
         class="text-neutral-200 bg-neutral-800 rounded-lg p-2"
      />
      <label for="importance" class="text-neutral-100">Importance</label>
      <div class="grid grid-cols-3 gap-2">
         <ButtonRadio
            v-for="importance in importances"
            :key="importance"
            :importanceData="todo.importance"
            :importance="importance"
            @update:importanceData="updateImportance"
         />
      </div>

      <label for="subtask" class="text-neutral-100">Subtasks</label>
      <input
         v-model="newSubTask"
         id="subtask"
         placeholder="Add a subtask"
         class="text-neutral-200 bg-neutral-800 rounded-lg p-2"
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
            {{ subTask.label }}
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
</template>../firebase
