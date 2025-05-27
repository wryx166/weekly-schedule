<script lang="ts" setup>
import MainTable from '@/components/MainTable.vue'
import DateDisplayTrigger from '@/components/DateDisplayTrigger.vue'
</script>

<template>
  <div
    class="main grid grid-rows-[29%_4.3%_3.1%_41%] justify-items-center items-center h-[100vh] w-[150vh] bg-cover bg-center bg-[url('/src/assets/images/bg.webp')]"
  >
    <div class="w-full row-start-1"/>
    <DateDisplayTrigger
      class="row-start-2 w-full h-full"
    />
    <div class="w-full row-start-3"/>
    <MainTable
      class="row-start-4 w-[95.14%] h-full"
    />
  </div>
</template>

<style scoped></style>
