<script>
   import Header from "./components/Header.vue";
   import { RouterView } from "vue-router";

   export default {
      name: "App",
      setup() {
         return {
            title: "DigiChat",
         };
      },
      components: {
         Header,
         RouterView,
      },
   };
</script>

<template>
   <Header />
   <main class="min-h-screen text-neutral-50 xl:py-20 px-4 md:px-20 xl:px-40">
      <RouterView></RouterView>
   </main>
</template>
