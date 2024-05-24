<script>
   import Header from "./components/Header.vue";
   import Footer from "./components/Footer.vue";
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
         Footer,
      },
   };
</script>

<template>
   <Header />
   <main class="text-neutral-50 xl:py-20 px-4 md:px-20 xl:px-40">
      <RouterView></RouterView>
   </main>
   <Footer />
</template>
