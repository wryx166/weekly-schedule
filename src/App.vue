<script setup>
import MainTable from "@/components/MainTable.vue";
import DateDisplayTrigger from "@/components/DateDisplayTrigger.vue";
</script>

<template>
  <div class="flex items-center flex-col main">
    <div class="h-[29%]" />
    <DateDisplayTrigger class="h-[4.3%] flex items-center justify-center" />
    <div class="h-[3.1%]" />
    <MainTable
      class="flex w-[95.14%] h-[40.5%] divide-x-4 divide-sxwz border-4 border-sxwz"
    />
  </div>
</template>

<style scoped></style>
