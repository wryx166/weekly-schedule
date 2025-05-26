<script setup>
import { computed, onMounted, ref, watch } from 'vue'
import { DayType, SessionType, VtuberType } from '@/data.js'
import { useScheduleStore } from '@/store/scheduleStore.js'
import dayjs from 'dayjs'

const scheduleStore = useScheduleStore()
const randomData = ref(scheduleStore.randomData)
const openDrawer = ref(false)
const currentDay = ref(null)
const customFontSize = ref(3)

class TimePickerDialog {
  constructor (open = false, value = null, currentLive = null) {
    this.open = open
    this.value = value
    this.currentLive = currentLive
  }
}

const timePickerDialog = ref(new TimePickerDialog())
const confirmTimePicker = () => {
  timePickerDialog['value'].currentLive.startingTime = timePickerDialog['value'].value
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
    () => currentDay.value?.early?.vtuberName,
    (newVal, oldVal) => {
      console.log('早场VTuber变更:', oldVal, '=>', newVal)
      // 在这里处理变更逻辑
      console.log(currentDay)
      currentDay.value?.early?.updateVtuber(newVal)
    }
)

watch(
    () => currentDay.value?.late?.vtuberName,
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
      <div class="flex h-[26.66%] w-full flex-col items-center" @click="showDrawer(daySchedule)">
        <div class="h-[13%]"/>
        <div
            class="h-[38%] text-sxwz text-[3.5vh] font-display items-center flex justify-center"
        >
          {{ randomData.data[index].dayOfWeek }}
        </div>
        <div class="h-[14.7%]"/>
        <time class="day text-sxwz-light text-[3vh] font-display h-[21%] items-center flex justify-center">
          {{ randomData.data[index].date }}
        </time>
      </div>
      <transition mode="out-in" name="icon-blur">
        <div :key="daySchedule.type" class="flex-grow flex w-full flex-col divide-y-[0.5vh] divide-sxwz">
          <div
              v-for="(live, timeKey) in {
            [SessionType.EARLY]: daySchedule[SessionType.EARLY],
            [SessionType.LATE]: daySchedule[SessionType.LATE],
          }"
              v-if="daySchedule.type === DayType.NORMAL"
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
                  :key="`${live.vtuberName}-${timeKey}`"
                  class="text-sxwz text-[3vh] font-display select-none"
                  @click="live.handleVtuberClick()"
              >
                {{ VtuberType[live.vtuberName] }}
              </div>
            </transition>
            <transition mode="out-in" name="icon-blur">
              <div :key="live.vtuberName" :class="live.vtuberName" class="icon"></div>
            </transition>
          </div>
          <div v-if="daySchedule.type === DayType.REST_DAY" class="w-full h-full flex items-center justify-center">
            <img alt="" class="w-2/3" src="/src/assets/images/rest.png">
          </div>
          <div v-if="daySchedule.type === DayType.GROUP_BROADCASTING"
               class="w-full h-full flex items-center justify-center flex-col relative">
            <div
                class="text-sxwz text-[3vh] font-display select-none"
            >
              {{ daySchedule.groupBroadcasting.startingTime?.format('HH:mm') }}
            </div>
            <transition mode="out-in" name="icon-blur">
              <div
                  :style="{ fontSize: customFontSize + 'vh' }"
                  class="text-sxwz font-display select-none text-center"
                  v-html="daySchedule.groupBroadcasting.customContent.replace(/\n/g, '<br>')"
              >
              </div>
            </transition>
            <transition mode="out-in" name="icon-blur">
              <div :key="daySchedule.groupBroadcasting.vtuberName" :class="daySchedule.groupBroadcasting.vtuberName"
                   class="icon"></div>
            </transition>
          </div>
        </div>
      </transition>
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
        <a-descriptions-item :span="3" label="日期">
          {{ currentDay.day.format('YYYY-MM-DD') }} {{ currentDay.dayOfWeek }}
        </a-descriptions-item>
        <a-descriptions-item :span="3" label="类型">
          <a-radio-group v-model:value="currentDay.type" class="w-full flex">
            <a-radio-button value="normal">正常</a-radio-button>
            <a-radio-button value="groupBroadcasting">团播</a-radio-button>
            <a-radio-button value="restDay">休息日</a-radio-button>
            <a-radio-button value="null">空白</a-radio-button>
          </a-radio-group>
        </a-descriptions-item>
        <a-descriptions-item v-if="currentDay.type === DayType.NORMAL" :span="3" label="时间">
          <a-time-picker v-model:value="currentDay['early'].startingTime" :allowClear="false" format="HH:mm"/>
        </a-descriptions-item>
        <a-descriptions-item v-if="currentDay.type === DayType.NORMAL" :span="3" label="早场">
          <a-radio-group v-model:value="currentDay['early'].vtuberName" class="w-full flex">
            <a-radio-button value="lian">梨安</a-radio-button>
            <a-radio-button value="queenie">沐霂</a-radio-button>
            <a-radio-button value="bekki">恬豆</a-radio-button>
            <a-radio-button value="yoyi">又一</a-radio-button>
          </a-radio-group>
        </a-descriptions-item>
        <a-descriptions-item v-if="currentDay.type === DayType.NORMAL" :span="3" label="时间">
          <a-time-picker v-model:value="currentDay['late'].startingTime" :allowClear="false" format="HH:mm"/>
        </a-descriptions-item>
        <a-descriptions-item v-if="currentDay.type === DayType.NORMAL" :span="3" label="晚场">
          <a-radio-group v-model:value="currentDay['late'].vtuberName" class="w-full flex">
            <a-radio-button value="lian">梨安</a-radio-button>
            <a-radio-button value="queenie">沐霂</a-radio-button>
            <a-radio-button value="bekki">恬豆</a-radio-button>
            <a-radio-button value="yoyi">又一</a-radio-button>
          </a-radio-group>
        </a-descriptions-item>

        <a-descriptions-item v-if="currentDay.type === DayType.GROUP_BROADCASTING" :span="3" label="直播间图标">
          <a-radio-group v-model:value="currentDay['groupBroadcasting'].vtuberName" class="w-full flex">
            <a-radio-button value="lian">梨安</a-radio-button>
            <a-radio-button value="queenie">沐霂</a-radio-button>
            <a-radio-button value="bekki">恬豆</a-radio-button>
            <a-radio-button value="yoyi">又一</a-radio-button>
            <a-radio-button value="custom">不显示</a-radio-button>
          </a-radio-group>
        </a-descriptions-item>
        <a-descriptions-item v-if="currentDay.type === DayType.GROUP_BROADCASTING" :span="3" label="时间">
          <a-time-picker v-model:value="currentDay.groupBroadcasting.startingTime" :allowClear="false" format="HH:mm"/>
        </a-descriptions-item>
        <a-descriptions-item v-if="currentDay.type === DayType.GROUP_BROADCASTING" :span="3" label="内容字体大小">
          <div class="flex justify-center items-center w-2/3">
            <a-slider v-model:value="customFontSize" :max="6" :min="2" :step="0.1" class="w-2/3"/>
            <a-input-number v-model:value="customFontSize" :max="6" :min="2" addon-after="vh" class="w-1/3"/>
          </div>
        </a-descriptions-item>
        <a-descriptions-item
            v-if="currentDay.type === DayType.GROUP_BROADCASTING"
            :span="3" label="自定义直播间内容">
          <a-textarea v-model:value="currentDay['groupBroadcasting'].customContent" :auto-size="{ minRows: 3}"
                      placeholder="请输入直播间内容"/>
        </a-descriptions-item>
        <a-descriptions-item :span="3" label="元数据">
          <pre>{{ JSON.stringify(currentDay, null, 2) }}</pre>
        </a-descriptions-item>
      </a-descriptions>
      <br>
    </a-drawer>
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
