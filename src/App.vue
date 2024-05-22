<script>
   import AddTodo from "@/components/AddTodo.vue";
   import GetTodos from "@/components/GetTodos.vue";

   export default {
      components: {
         AddTodo,
         GetTodos,
      },
   };
</script>

<template>
   <section class="min-h-screen bg-neutral-900 flex gap-4 p-40">
      <AddTodo />
      <GetTodos />
   </section>
</template>
