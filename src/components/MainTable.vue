<script lang="ts" setup>
import { ref, watch, watchEffect } from "vue";
import { useStorage } from "@vueuse/core";
import { Day } from "@/models/Day.ts";
import dayjs from "dayjs";
import DayDrawer from "@/components/DayDrawer.vue";

const { firstDay } = defineProps({
  firstDay: {
    required: true,
    type: dayjs.Dayjs,
  },
});

const defaultDayList = Array.from({ length: 7 }, (_, i) => new Day(firstDay.add(i, "day")));
const dayList = useStorage<Day[]>("day-list", defaultDayList, localStorage);

const openTime = useStorage<string>("open-time", firstDay.format("YYYY-MM-DD"), localStorage);

// 判断openTime是否超过2天，超过则重置dayList和openTime
const now = dayjs();
if (now.diff(dayjs(openTime.value), "day") >= 2) {
  dayList.value = defaultDayList;
  openTime.value = now.format("YYYY-MM-DD");
} else {
  openTime.value = now.format("YYYY-MM-DD");
}

watchEffect(() => {
  let start = firstDay;
  for (let i = 0; i < 7; i++) {
    const dayData: Day = dayList.value[i];
    if (dayData) {
      dayData.date = start.format("MM-DD");
      dayData.day = start.format("YYYY-MM-DD");
      dayData.dayOfWeek = start.format("ddd");
    }
    start = start.add(1, "day");
  }
  console.log("dayList updated:", dayList.value);
});

watch(
  dayList,
  (newDayList) => {
    console.log("dayList changed:", newDayList);
  },
  { deep: true },
);

const isOpen = ref(false);
const currentDay = ref<Day | undefined>();
const showDrawer = (day: Day) => {
  isOpen.value = true;
  currentDay.value = day;
};
</script>

<template>
  <div class="flex divide-x-[0.5vh] divide-sxwz border-[0.5vh] border-sxwz">
    <div
      v-for="(day, index) in dayList"
      :key="index"
      class="flex flex-1 flex-col divide-y-[0.5vh] divide-sxwz"
      @click="showDrawer(day)"
    >
      <DayBlock :day />
    </div>

    <a-drawer v-model:open="isOpen" placement="right" width="530">
      <DayDrawer v-if="currentDay" v-model:current-day="currentDay" />
    </a-drawer>
  </div>
</template>

<style scoped></style>
