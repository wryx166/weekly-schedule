<script lang="ts" setup>
import {onMounted, ref, watch, watchEffect} from 'vue'
import {DayType, LiveType, VtuberIconToEN} from '@/data.ts'
import {Day} from '@/models/Day.ts'
import {Live} from '@/models/Live.ts'
import dayjs from "dayjs";
import DayDrawer from "@/components/DayDrawer.vue";

const {firstDay} = defineProps({
  firstDay: {
    required: true,
    type: dayjs.Dayjs
  }
})
const dayList = ref<Day[]>([])

watchEffect(() => {
  let start = dayjs(firstDay)
  for (let i = 0; i < 7; i++) {
    const dayData: Day = dayList.value[i]
    if (dayData) {
      dayData.date = start.format('MM.DD')
      dayData.day = start
      dayData.dayOfWeek = start.format('ddd')
    }
    start = start.add(1, 'day')
  }
  console.log('dayList updated:', dayList.value)
})

onMounted(() => {
  const raw = localStorage.getItem('dayList')
  const generatedAt = localStorage.getItem('dayListGeneratedAt')
  let needRegenerate = false
  if (raw && generatedAt) {
    const last = dayjs(generatedAt, 'YYYY-MM-DD HH:mm:ss')
    const now = dayjs()
    const hourDiff = now.diff(last, 'hour')
    const dayDiff = now.diff(last, 'day')
    if (hourDiff >= 12 && dayDiff >= 1) {
      needRegenerate = true
    }
  } else {
    needRegenerate = true
  }
  if (!needRegenerate && raw) {
    dayList.value = JSON.parse(raw).map((obj: any) => Day.fromJSON(obj))
  } else {
    dayList.value = Array.from({length: 7}, (_, i) => new Day(firstDay.add(i, "day")))
    localStorage.setItem('dayList', JSON.stringify(dayList.value.map(day => day.toJSON())))
  }
  localStorage.setItem('dayListGeneratedAt', dayjs().format('YYYY-MM-DD HH:mm:ss'))
})

watch(dayList, (newDayList) => {
  console.log('dayList changed:', newDayList)
  localStorage.setItem('dayList', JSON.stringify(dayList.value.map(day => day.toJSON())))
}, {deep: true})

const openDrawer = ref(false)
const currentDay = ref<Day | undefined>()


const startingTimeText = (live: Live) => {
  return live.startingTime.format('HH:mm')
}

const showDrawer = (day: Day) => {
  openDrawer.value = true
  currentDay.value = day

  console.log('open', day)
}

</script>

<template>
  <div :class="$attrs.class" class=" flex divide-x-[0.5vh] divide-sxwz border-[0.5vh] border-sxwz">
    <div
      v-for="(day, index) in dayList"
      :key="index"
      class="flex w-1/7 h-full flex-col divide-y-[0.5vh] divide-sxwz"
      @click="showDrawer(day)"
    >
      <div class="flex h-[30%] w-full flex-col items-center">
        <div class="h-[13%]"/>
        <div
          class="h-[38%] text-sxwz text-[5vh] font-display items-center flex justify-center"
        >
          {{ day.dayOfWeek }}
        </div>
        <div class="h-[14.7%]"/>
        <time
          class="day text-sxwz-light text-[2.75vh] font-display h-[21%] items-center flex justify-center">
          {{ day.date }}
        </time>
      </div>
      <transition mode="out-in" name="icon-blur">
        <div :key="day.type"
             class="flex-grow flex w-full flex-col divide-y-[0.5vh] divide-sxwz">
          <div
            v-for="(live, timeKey) in {
            'early': day.early,
            'late': day.late,
          }"
            v-if="day.type === DayType.NORMAL"
            :key="timeKey"
            class="h-[50%] flex flex-col items-center justify-center relative"
          >
            <div
              class="text-sxwz text-[4.75vh] leading-[5vh]  font-display select-none"
            >
              {{ startingTimeText(live) }}
            </div>
            <transition mode="out-in" name="icon-blur">
              <div
                v-if="live.type !== LiveType.CUSTOM"
                :key="`${live.icon}-${timeKey}`"
                :style="{ fontSize: `${live.fontSize}vh` }"
                class="text-sxwz font-display select-none leading-[5vh] "
              >
                {{ live.content }}
              </div>
              <div v-else
                   :key="`${live.content}-${timeKey}`"
                   :style="{ fontSize: `${live.fontSize}vh` }"
                   class="text-sxwz font-display select-none text-center leading-[5vh] "
                   v-html="live.content.replace(/ /g, '&nbsp;').replace(/\n/g, '<br>')"/>
            </transition>

            <transition mode="out-in" name="icon-blur">
              <div :key="live.icon" :class="VtuberIconToEN[live.icon]"
                   class="icon"></div>
            </transition>
          </div>
          <div v-if="day.type === DayType.REST_DAY"
               class="w-full h-full flex items-center justify-center">
            <img alt="" class="w-2/3" src="/src/assets/images/rest.png">
          </div>
          <div v-if="day.type === DayType.GROUP"
               class="w-full h-full flex items-center justify-center flex-col relative">
            <div
              class="text-sxwz text-[4.75vh] font-display select-none leading-[5vh] "
            >
              {{ day.group.startingTime?.format('HH:mm') }}
            </div>
            <transition mode="out-in" name="icon-blur">
              <div
                :style="{ fontSize: `${day.group.fontSize}vh` }"
                class="text-sxwz font-display select-none text-center leading-[5vh] "
                v-html="day.group.content.replace(/ /g, '&nbsp;').replace(/\n/g, '<br>')"
              >
              </div>
            </transition>
            <transition mode="out-in" name="icon-blur">
              <div :key="day.group.icon"
                   :class="VtuberIconToEN[day.group.icon]"
                   class="icon"></div>
            </transition>
          </div>
        </div>
      </transition>
    </div>


    <DayDrawer
      v-if="openDrawer && currentDay"
      v-model:current-day="currentDay"
      v-model:open-drawer="openDrawer"
    />
  </div>
</template>

<!--suppress CssUnusedSymbol -->
<style scoped>
.icon-blur-enter-active,
.icon-blur-leave-active {
  transition: filter 0.15s ease,
  opacity 0.15s ease;
}

.icon-blur-enter-from,
.icon-blur-leave-to {
  filter: blur(2px);
  opacity: 0.8;
}

.icon-blur-enter-to,
.icon-blur-leave-from {
  filter: blur(0);
  opacity: 1;
}
</style>
