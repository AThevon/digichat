<script>
   import { defineComponent } from "vue";

   export default defineComponent({
      name: "ChatLine",
      props: {
         userName: {
            type: String,
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
   });
</script>

<template>
   <li>
      <h3>{{ userName }}</h3>
      <p>{{ content }}</p>
      <p>{{ created_at.toLocaleString() }}</p>
   </li>
</template>
