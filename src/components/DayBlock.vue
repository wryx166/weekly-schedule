<script setup lang="ts">
import { DayType } from "@/data.ts";
import type { Day } from "@/models/Day";
import LiveTimeBlock from "@/components/LiveTimeBlock.vue";
defineModel<Day>("day", { required: true });
</script>

<template>
  <div class="flex h-[30%] flex-col items-center justify-center gap-[14.7%]">
    <div class="flex h-[38%] items-center justify-center font-display text-[5vh] text-sxwz">
      {{ day.dayOfWeek }}
    </div>
    <time
      class="day flex h-[21%] items-center justify-center font-display text-[2.75vh] text-sxwz-light"
    >
      {{ day.date }}
    </time>
  </div>
  <div class="flex flex-1 flex-col divide-y-[0.5vh] divide-sxwz">
    <LiveTimeBlock :live="day.early" v-if="day.type === DayType.NORMAL" class="flex-1" />
    <LiveTimeBlock :live="day.late" v-if="day.type === DayType.NORMAL" class="flex-1" />
    <div
      v-if="day.type === DayType.REST_DAY"
      class="flex h-full w-full items-center justify-center"
    >
      <img alt="" class="w-2/3" src="/src/assets/images/rest.png" />
    </div>
    <LiveTimeBlock :live="day.group" v-if="day.type === DayType.GROUP" />
  </div>
</template>

<style scoped></style>
