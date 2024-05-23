<script>
   import { defineComponent } from "vue";

   export default defineComponent({
      name: "ChatLine",
      props: {
         userName: {
            type: Object,
            required: true,
         },
         content: {
            type: String,
            required: true,
         },
         created_at: {
            type: String,
            required: true,
         },
      },
      methods: {
         formatDate(date) {
            const dateOptions = {
               weekday: "short",
               day: "2-digit",
               month: "short",
            };
            return date.toLocaleDateString([], dateOptions);
         },
         formatTime(date) {
            const timeOptions = { hour: "2-digit", minute: "2-digit" };
            return date.toLocaleTimeString([], timeOptions);
         },
      },
   });
</script>

<template>
   <div
      class="flex flex-col px-4 pt-2 pb-4 bg-neutral-800 rounded-2xl shadow-md transition-all"
   >
      <div class="flex justify-between">
         <h3 class="text-neutral-400">{{ userName.firstName }}</h3>
         <div class="flex flex-col items-end text-end text-neutral-500">
            <p>{{ formatDate(created_at) }}</p>
            <p>{{ formatTime(created_at) }}</p>
         </div>
      </div>
      <p class="px-2">{{ content }}</p>
   </div>
</template>
