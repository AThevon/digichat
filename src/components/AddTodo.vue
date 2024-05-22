<script>
   import { defineComponent } from "vue";
   import { db } from "../../firebase";
   import { collection, addDoc } from "firebase/firestore";

   export default defineComponent({
      data() {
         return {
            todo: {
               label: "",
               description: "",
            },
         };
      },
      methods: {
         async addTodo() {
            try {
               const docRef = await addDoc(collection(db, "to_do"), {
                  label: this.todo.label,
                  description: this.todo.description,
               });
               console.log("Document written with ID: ", docRef.id);
            } catch (e) {
               console.error("Error adding document: ", e);
            }
         },
      },
   });
</script>

<template>
   <form @submit.prevent="addTodo" class="flex flex-col gap-2 w-full">
      <input
         v-model="todo.label"
         placeholder="Enter a title"
         class="text-neutral-800 rounded p-2"
      />
      <input
         v-model="todo.description"
         placeholder="Enter a description"
         class="text-neutral-800 rounded p-2"
      />
      <button
         class="rounded bg-neutral-600 text-neutral-100 uppercase font-normal py-3 px-6 transition-all duration-150 hover:bg-neutral-700 active:scale-95"
      >
         Add Todo
      </button>
   </form>
</template>
