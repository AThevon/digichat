<script>
   import { defineComponent } from "vue";

   export default defineComponent({
      props: {
         importanceData: {
            type: String,
            required: true,
         },
         importance: {
            type: String,
            required: true,
         },
      },
      methods: {
         updateImportance() {
            this.$emit("update:importanceData", this.importance);
         },
      },
   });
</script>

<template>
   <label
      class="flex items-center justify-center cursor-pointer rounded-2xl h-12"
      :class="{
         'bg-green-500 text-neutral-800':
            importanceData === importance && importanceData === 'low',
         'bg-yellow-500 text-neutral-800':
            importanceData === importance && importanceData === 'medium',
         'bg-red-500 text-neutral-200':
            importanceData === importance && importanceData === 'high',
         'bg-neutral-200 text-neutral-800': importanceData !== importance,
      }"
      @click="updateImportance"
   >
      <input
         type="radio"
         :value="importance"
         :checked="importanceData === importance"
         class="hidden"
      />
      <span
         class="flex px-4 py-2 text-center rounded-md transition-all duration-150 font-medium capitalize"
         >{{ importance }}
      </span>
   </label>
</template>
