<script>
   import { defineComponent } from "vue";

   export default defineComponent({
      name: "LoaderCustom",
   });
</script>

<template>
   <div
      class="fixed flex justify-center items-center h-screen w-full bg-neutral-900 bg-opacity-90 z-40 top-0 left-0"
      v-motion
      enter="transition duration-300 ease-in-out transform"
      enter-from="opacity-0 scale-95"
      enter-to="opacity-100 scale-100"
      leave="transition duration-300 ease-in-out transform"
      leave-from="opacity-100 scale-100"
      leave-to="opacity-0 scale-95"
   >
      <svg
         class="animate-spin h-12 w-12 text-primary-500 z-50"
         xmlns="http://www.w3.org/2000/svg"
         fill="none"
         viewBox="0 0 24 24"
      >
         <circle
            class="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            stroke-width="4"
         ></circle>
         <path
            class="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A8 8 0 0012 20v-4a4 4 0 00-4-4V7.709L6.709 9.29z"
         ></path>
      </svg>
   </div>
</template>
