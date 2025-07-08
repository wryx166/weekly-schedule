<script lang="ts" setup>
import { onMounted, ref, watch, watchEffect } from "vue";
import { Day } from "@/models/Day.ts";
import dayjs from "dayjs";
import DayDrawer from "@/components/DayDrawer.vue";

const { firstDay } = defineProps({
  firstDay: {
    required: true,
    type: dayjs.Dayjs,
  },
});
const dayList = ref<Day[]>([]);

watchEffect(() => {
  let start = dayjs(firstDay);
  for (let i = 0; i < 7; i++) {
    const dayData: Day = dayList.value[i];
    if (dayData) {
      dayData.date = start.format("MM.DD");
      dayData.day = start;
      dayData.dayOfWeek = start.format("ddd");
    }
    start = start.add(1, "day");
  }
  console.log("dayList updated:", dayList.value);
});

onMounted(() => {
  const raw = localStorage.getItem("dayList");
  const generatedAt = localStorage.getItem("dayListGeneratedAt");
  let needRegenerate = false;
  if (raw && generatedAt) {
    const last = dayjs(generatedAt, "YYYY-MM-DD HH:mm:ss");
    const now = dayjs();
    const hourDiff = now.diff(last, "hour");
    const dayDiff = now.diff(last, "day");
    if (hourDiff >= 12 && dayDiff >= 1) {
      needRegenerate = true;
    }
  } else {
    needRegenerate = true;
  }
  if (!needRegenerate && raw) {
    dayList.value = JSON.parse(raw).map((obj: Day) => Day.fromJSON(obj));
  } else {
    dayList.value = Array.from({ length: 7 }, (_, i) => new Day(firstDay.add(i, "day")));
    localStorage.setItem("dayList", JSON.stringify(dayList.value.map((day) => day.toJSON())));
  }
  localStorage.setItem("dayListGeneratedAt", dayjs().format("YYYY-MM-DD HH:mm:ss"));
});

watch(
  dayList,
  (newDayList) => {
    console.log("dayList changed:", newDayList);
    localStorage.setItem("dayList", JSON.stringify(dayList.value.map((day) => day.toJSON())));
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
