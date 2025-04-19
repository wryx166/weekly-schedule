<script setup>
import {ref} from "vue";
import {dateRange} from "@/data.js";
import MainTable from "@/components/MainTable.vue";

// 响应式状态
const drawer = ref(false);
</script>

<template>
  <div class="flex items-center flex-col main">
    <div class="h-[29%]"/>
    <div class="h-[4.3%] flex items-center justify-center">
      <time class="date-range ml-[1%]" @click="drawer = true">
        {{ dateRange }}
      </time>
    </div>
    <div class="h-[3.1%]"/>
    <MainTable class="sss"/>
  </div>
</template>

<style scoped></style>
