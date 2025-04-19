<script setup>
import { computed, onMounted, ref } from 'vue'
import {
  dayClassToChinese,
  daysOfWeek,
  formatWithLeadingZero,
  getDefaultData,
  SessionType,
  startOfWeek,
} from '@/data.js'

const weekList = computed(() => {
  const start = new Date(startOfWeek.value)
  const days = []
  for (let i = 0; i < 7; i++) {
    const month = formatWithLeadingZero(2, start.getMonth() + 1)
    const date = formatWithLeadingZero(2, start.getDate())
    const dayOfWeek = dayClassToChinese[daysOfWeek[start.getDay()]]
    days.push({
      date: `${month}.${date}`,
      dayOfWeek: dayOfWeek,
    })
    start.setDate(start.getDate() + 1)
  }
  return days
})

function generateScheduleData () {
  return Array.from({ length: 7 }, (_, index) => ({
    day: weekList.value[index].dayOfWeek, // 直接使用已计算的星期
    [SessionType.EARLY]: generateSession('18:30'),
    [SessionType.LATE]: generateSession('21:00')
  }))
}

// 单独的时间段生成函数
function generateSession (time) {
  const characters = ['沐霂', '梨安', '恬豆', '又一']
  const classes = {
    '沐霂': ['queenie', 'special-name'],
    '梨安': 'lian',
    '恬豆': 'bekki',
    '又一': 'yoyi'
  }
  const data = getDefaultData(time)
  data['name'] = characters[Math.floor(Math.random() * characters.length)]
  data['class'] = classes[data.name]

  return data
}

const randomData = ref([])
onMounted(() => {
  randomData.value = generateScheduleData()
})
</script>

<template>
  <div
      class="flex w-[95.14%] h-[40.5%] divide-x-4 divide-sxwz border-4 border-sxwz"
  >
    <div
        v-for="(daySchedule, index) in randomData"
        :key="index"
        class="flex w-1/7 h-full flex-col divide-y-4 divide-sxwz"
    >
      <div class="flex h-[26.66%] w-full flex-col items-center">
        <div class="h-[13%]"/>
        <div class="day-of-week h-[38%] items-center flex justify-center">
          {{ weekList[index].dayOfWeek }}
        </div>
        <div class="h-[14.7%]"/>
        <time class="day h-[21%] items-center flex justify-center">
          {{ weekList[index].date }}
        </time>
      </div>
      <div class="core flex-grow flex w-full flex-col divide-y-4 divide-sxwz">
        <div
            v-for="(session, timeKey) in {[SessionType.EARLY]: daySchedule[SessionType.EARLY], [SessionType.LATE]: daySchedule[SessionType.LATE]}"
            :key="timeKey"
            class="flex-grow flex flex-col items-center justify-center with-image"
            :class="session.class"
        >
          <div class="hourAndMinute">{{ session.startingTime }}</div>
          <div class="name">{{ session.name }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
