<script>
   import { defineComponent } from "vue";

   export default defineComponent({
      name: "ChatLine",
      props: {
         userName: {
            type: Object,
            required: true,
         },
         userPhotoUrl: {
            type: String,
         },
         content: {
            type: String,
            required: true,
         },
         created_at: {
            type: String,
         },
      },
      methods: {
         formatDate(dateString) {
            const date = new Date(dateString);
            const dateOptions = {
               weekday: "short",
               day: "2-digit",
               month: "short",
            };
            return date.toLocaleDateString([], dateOptions);
         },
         formatTime(dateString) {
            const date = new Date(dateString);
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
         <div class="flex items-center gap-2">
            <img
               :src="userPhotoUrl"
               alt="User Photo"
               class="w-6 h-6 rounded-full object-cover"
            />
            <h3 class="text-neutral-400 font-medium">
               {{ userName.firstName }}
            </h3>
         </div>
         <div class="flex flex-col items-end text-end text-neutral-500">
            <p>{{ formatDate(created_at) }}</p>
            <p>{{ formatTime(created_at) }}</p>
         </div>
      </div>
      <p class="px-2 break-all font-sans">{{ content }}</p>
   </div>
</template>
