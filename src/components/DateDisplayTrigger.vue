<script setup>
import { computed, onMounted, ref } from "vue";
import { useScheduleStore } from "@/store/scheduleStore.js";

const scheduleStore = useScheduleStore();
const randomData = ref(scheduleStore.randomData);
const open = ref(false);
const value1 = ref();
onMounted(() => {
  scheduleStore.updateRandomData(randomData);
});
const showModal = () => {
  open.value = true;
  value1.value = randomData["value"].dateRange;
};

const handleOk = (e) => {
  console.log(e);
  randomData["value"].updateDateRange(value1.value);
  open.value = false;
};
const dateRangeText = computed(() => {
  const start = randomData["value"].dateRange;
  const end = start.add(6, "day");
  return `${start.format("YYYY.MM.DD")}-${end.format("YYYY.MM.DD")}`;
});
</script>

<template>
  <div :class="$attrs.class" class="flex items-center justify-center">
    <time
      class="date-range ml-[1%] text-sxwz-light w-full text-center text-[3.5vh] font-[AlibabaPuHuiTi-3-75-SemiBold]"
      @click="showModal(dateRangeText)"
    >
      {{ dateRangeText }}
    </time>
  </div>
  <a-modal v-model:open="open" title="Basic Modal" @ok="handleOk">
    <a-date-picker v-model:value="value1" />
  </a-modal>
</template>

<style scoped></style>
