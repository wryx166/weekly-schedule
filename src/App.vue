<script lang="ts" setup>
import MainTable from "@/components/MainTable.vue";
import DateDisplayTrigger from "@/components/DateDisplayTrigger.vue";
import { onMounted, ref, watch } from "vue";
import dayjs from "dayjs";

const firstDay = ref<dayjs.Dayjs>(dayjs());

onMounted(() => {
  const stored = localStorage.getItem("firstDay");
  if (!stored) {
    localStorage.setItem("firstDay", firstDay.value.format("YYYY-MM-DD"));
  } else {
    firstDay.value = dayjs(stored);
  }
});

watch(firstDay, (val) => {
  localStorage.setItem("firstDay", val.format("YYYY-MM-DD"));
});
</script>

<template>
  <div
    class="main grid h-[100vh] w-[150vh] grid-rows-[29%_4.3%_3.1%_41%] items-center justify-items-center bg-[url('/src/assets/images/bg.webp')] bg-cover bg-center"
  >
    <div class="row-start-1 w-full" />
    <DateDisplayTrigger v-model:first-day="firstDay" class="row-start-2" />
    <div class="row-start-3 w-full" />
    <MainTable :first-day="firstDay" class="row-start-4 h-full w-[95.14%]" />
  </div>
</template>

<style scoped></style>
