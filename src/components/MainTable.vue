<script setup>
import { computed, onMounted, ref, watch } from 'vue'
import { SessionType } from '@/data.js'
import { useScheduleStore } from '@/store/scheduleStore.js'
import dayjs from 'dayjs'

const scheduleStore = useScheduleStore()
const randomData = ref(scheduleStore.randomData)
const openDrawer = ref(false)
const currentDay = ref(null)

class TimePickerDialog {
  constructor (open = false, value = null, currentLive = null) {
    this.open = open
    this.value = value
    this.currentLive = currentLive
  }
}

const timePickerDialog = ref(new TimePickerDialog())
const confirmTimePicker = () => {
  timePickerDialog['value'].currentLive.startingTime =
      timePickerDialog['value'].value
  timePickerDialog['value'].open = false
  timePickerDialog['value'].value = null
}
onMounted(() => {
  scheduleStore.updateRandomData(randomData)
})

const openTimePicker = (live) => {
  console.log('Starting time clicked')
  timePickerDialog['value'].currentLive = live
  timePickerDialog['value'].value = live.startingTime
  timePickerDialog['value'].open = true
}

function isSameHourAndMinute (time1, time2) {
  if (!time1 || !time2) throw new Error('Invalid time values provided')
  return dayjs(time1).isSame(dayjs(time2), 'minute')
}

const startingTimeText = (live) => {
  return live.startingTime.format('HH:mm')
}

const okButtonProps = computed(() => {
  if (
      !timePickerDialog['value']?.value ||
      !timePickerDialog['value']?.currentLive?.startingTime
  )
    return {
      disabled: true,
    }
  return {
    disabled: isSameHourAndMinute(
        timePickerDialog['value'].value,
        timePickerDialog['value'].currentLive.startingTime,
    ),
  }
})

const onFinish = (values) => {
  console.log('Success:', values)
}

const onFinishFailed = (errorInfo) => {
  console.log('Failed:', errorInfo)
}

const afterOpenChange = (bool) => {
  console.log('open', bool)
}

const showDrawer = (day) => {
  openDrawer.value = true
  currentDay.value = day
  console.log('open', day)
}

const dateRangePassword = computed({
  get () {
    return randomData.value.dateRange
        ? dayjs(randomData.value.dateRange).format('MM:DD')
        : ''
  },
  set (val) {
    randomData.value.dateRange = val ? dayjs(val, 'MM:DD') : null
  },
})

watch(
    () => currentDay.value?.early?.name,
    (newVal, oldVal) => {
      console.log('早场VTuber变更:', oldVal, '=>', newVal)
      // 在这里处理变更逻辑
      console.log(currentDay)
      currentDay.value?.early?.updateVtuber(newVal)
    }
)

watch(
    () => currentDay.value?.late?.name,
    (newVal, oldVal) => {
      console.log('早场VTuber变更:', oldVal, '=>', newVal)
      // 在这里处理变更逻辑
      console.log(currentDay)
      currentDay.value?.late?.updateVtuber(newVal)
    }
)
</script>

<template>
  <div :class="$attrs.class" class=" flex divide-x-[0.5vh] divide-sxwz border-[0.5vh] border-sxwz">
    <div
        v-for="(daySchedule, index) in randomData.data"
        :key="index"
        class="flex w-1/7 h-full flex-col divide-y-[0.5vh] divide-sxwz"
    >
      <div class="flex h-[26.66%] w-full flex-col items-center">
        <div class="h-[13%]"/>
        <div
            class="h-[38%] text-sxwz text-[3.5vh] font-display items-center flex justify-center"
        >
          {{ randomData.data[index].dayOfWeek }}
        </div>
        <div class="h-[14.7%]"/>
        <time
            class="day text-sxwz-light text-[3vh] font-display h-[21%] items-center flex justify-center"
            @click="showDrawer(daySchedule)"
        >
          {{ randomData.data[index].date }}
        </time>
      </div>

      <div class="flex-grow flex w-full flex-col divide-y-[0.5vh] divide-sxwz">
        <div
            v-for="(live, timeKey) in {
            [SessionType.EARLY]: daySchedule[SessionType.EARLY],
            [SessionType.LATE]: daySchedule[SessionType.LATE],
          }"
            v-if="!daySchedule.isRestDay"
            :key="timeKey"
            class="flex-grow flex flex-col items-center justify-center relative"
        >
          <div
              class="text-sxwz text-[3vh] font-display select-none"
              @click="openTimePicker(live)"
          >
            {{ startingTimeText(live) }}
          </div>
          <transition mode="out-in" name="icon-blur">
            <div
                :key="`${live.name}-${timeKey}`"
                class="text-sxwz text-[3vh] font-display select-none"
                @click="live.handleVtuberClick()"
            >
              {{ live.name }}
            </div>
          </transition>
          <transition mode="out-in" name="icon-blur">
            <div :key="live.class" :class="live.class" class="icon"></div>
          </transition>
        </div>
        <div v-if="daySchedule.isRestDay" class="w-full h-full flex items-center justify-center">
          <img src="/src/assets/images/rest.png">
        </div>
      </div>
    </div>
  </div>
  <a-modal
      v-model:open="timePickerDialog.open"
      :okButtonProps="okButtonProps"
      title="Basic Modal"
      @ok="confirmTimePicker"
  >
    <a-time-picker
        v-model:value="timePickerDialog.value"
        :allowClear="false"
        format="HH:mm"
    />
  </a-modal>
  <a-drawer
      v-model:open="openDrawer"
      :root-style="{ color: 'blue' }"
      class="custom-class"
      placement="right"
      root-class-name="root-class-name"
      size="large"
      style="color: red"
      title="Basic Drawer"
      @after-open-change="afterOpenChange"
  >
    <a-descriptions>
      <a-descriptions-item :span="3" label="元数据">{{ currentDay }}</a-descriptions-item>
      <a-descriptions-item :span="3" label="日期">{{ currentDay.day.format('YYYY-MM-DD') }} {{
          currentDay.dayOfWeek
        }}
      </a-descriptions-item>
      <a-descriptions-item :span="3" label="团播">
        <a-radio-group v-model:value="currentDay.isGroupBroadcasting">
          <a-radio-button :value="true">是</a-radio-button>
          <a-radio-button :value="false">否</a-radio-button>
        </a-radio-group>
      </a-descriptions-item>
      <a-descriptions-item :span="3" label="休息日">
        <a-radio-group v-model:value="currentDay.isRestDay" class="w-full flex">
          <a-radio-button :value="true">是</a-radio-button>
          <a-radio-button :value="false">否</a-radio-button>
        </a-radio-group>
      </a-descriptions-item>
      <a-descriptions-item :span="3" label="早场">
        <a-radio-group v-model:value="currentDay['early'].name" class="w-full flex">
          <a-radio-button value="梨安">梨安</a-radio-button>
          <a-radio-button value="沐霂">沐霂</a-radio-button>
          <a-radio-button value="恬豆">恬豆</a-radio-button>
          <a-radio-button value="又一">又一</a-radio-button>
        </a-radio-group>
      </a-descriptions-item>
      <a-descriptions-item :span="3" label="晚场">
        <a-radio-group v-model:value="currentDay['late'].name" class="w-full flex">
          <a-radio-button value="梨安">梨安</a-radio-button>
          <a-radio-button value="沐霂">沐霂</a-radio-button>
          <a-radio-button value="恬豆">恬豆</a-radio-button>
          <a-radio-button value="又一">又一</a-radio-button>
        </a-radio-group>
      </a-descriptions-item>
    </a-descriptions>
    <br>
  </a-drawer>
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
