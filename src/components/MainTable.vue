<script setup>
import { ref } from 'vue'
import {
  ScheduleDataList,
  SessionType,
} from '@/data.js'

const randomData = ref(new ScheduleDataList())

</script>

<template>
  <div
      class="flex w-[95.14%] h-[40.5%] divide-x-4 divide-sxwz border-4 border-sxwz"
  >
    <div
        v-for="(daySchedule, index) in randomData.data"
        :key="index"
        class="flex w-1/7 h-full flex-col divide-y-4 divide-sxwz"
    >
      <div class="flex h-[26.66%] w-full flex-col items-center">
        <div class="h-[13%]"/>
        <div class="day-of-week h-[38%] items-center flex justify-center">
          {{ randomData.data[index].dayOfWeek }}
        </div>
        <div class="h-[14.7%]"/>
        <time class="day h-[21%] items-center flex justify-center">
          {{ randomData.data[index].date }}
        </time>
      </div>
      <div class="core flex-grow flex w-full flex-col divide-y-4 divide-sxwz">
        <div
            v-for="(live, timeKey) in {
              [SessionType.EARLY]: daySchedule[SessionType.EARLY],
              [SessionType.LATE]: daySchedule[SessionType.LATE]
            }"
            :key="timeKey"
            :class="live.class"
            class="flex-grow flex flex-col items-center justify-center with-image"
        >
          <div class="hourAndMinute">{{ live.startingTime }}</div>
          <div class="name" @click="live.handleVtuberClick(live)">{{ live.name }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
