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
   <main
      class="min-h-screen text-neutral-50 bg-neutral-900 py-20 px-40 bg-gradient-to-br from-primary-700 to-neutral-950"
   >
      <RouterView></RouterView>
   </main>
</template>
