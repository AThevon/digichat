<script>
   import AddTodo from "@/components/AddTodo.vue";
   import GetTodos from "@/components/GetTodos.vue";

   export default {
      name: "Todo",
      components: {
         AddTodo,
         GetTodos,
      },
   };
</script>

<template>
   <section>
      <h2
         class="text-neutral-100 text-center text-3xl font-bold uppercase mb-10"
      >
         To do list
      </h2>
      <div class="grid grid-cols-[1fr_1fr] gap-4 px-20 max-w-[80rem] mx-auto">
         <AddTodo />
         <GetTodos />
      </div>
   </section>
</template>
