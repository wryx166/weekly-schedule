<script lang="ts" setup>
import {computed, defineProps, type Ref, ref, watchEffect} from 'vue'
import {
  Day,
  dayClassToChinese,
  daysOfWeek,
  DayType,
  IconType,
  Live,
  LiveType,
  VtuberIconToEN,
  VtuberType,
  VtuberTypeToIcon
} from '@/data.ts'
import {DownloadOutlined} from '@ant-design/icons-vue'
// noinspection SpellCheckingInspection
import domtoimage from 'dom-to-image'
import dayjs from "dayjs";

const { firstDay } = defineProps<{ firstDay: dayjs.Dayjs }>()
const dayList: Ref<Day[]> = Day.initDayList(firstDay);

watchEffect(() => {
  let start = dayjs(firstDay)
  for (let i = 0; i < 7; i++) {
    const dayData:Day = dayList.value[i]
    if (dayData) {
      dayData.date = start.format('MM.DD')
      dayData.dayOfWeek = dayClassToChinese[daysOfWeek[start.day()]]
    }
    start = start.add(1, 'day')
  }
  console.log('dayList updated:', dayList.value)
})

const openDrawer = ref(false)
const currentDay = ref<Day | null>(null)

const currentEarlyLive = computed(() => {
  return currentDay.value?.early
})
const currentLateLive = computed(() => {
  return currentDay.value?.late
})

const customEarlyVtuberType = ref('')
const customLateVtuberType = ref('')


const startingTimeText = (live: Live) => {
  return live.startingTime.format('HH:mm')
}

const showDrawer = (day: Day) => {
  openDrawer.value = true
  currentDay.value = day

  const {early, late} = day
  customEarlyVtuberType.value = early.content
  customLateVtuberType.value = late.content

  console.log('open', day)
}

const downloadScreenshot = () => {
  const mainDiv = document.querySelector('div.main')
  if (!mainDiv) {
    alert('未找到 .main 区域')
    return
  }
  domtoimage.toPng(mainDiv)
    .then(function (dataUrl) {
      const link = document.createElement('a')
      link.href = dataUrl
      link.download = 'screenshot.png'
      link.click()
    })
    .catch(function (error) {
      alert('截图失败: ' + error)
    })
}

function updateLiveType(live: Live | undefined, vtuberType: string) {
  if (!live) return
  if (vtuberType !== VtuberType.CUSTOM) {
    // 用于关闭自定义内容和图标
    live.type = LiveType.NORMAL
    // 更新显示内容为 vtuberType
    live.content = vtuberType
    // 更新图标为对应的vtuber
    live.icon = VtuberTypeToIcon[vtuberType]
  } else {
    // 打开自定义内容和图标
    live.type = LiveType.CUSTOM
    // 保留原有 content 和 icon
  }
}

watchEffect(() => {
  updateLiveType(currentEarlyLive.value, customEarlyVtuberType.value)
  updateLiveType(currentLateLive.value, customLateVtuberType.value)
})
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


    <a-drawer
      v-if="currentDay"
      v-model:open="openDrawer"
      :root-style="{ color: 'blue' }"
      placement="right"
      root-class-name="root-class-name"
      title="Basic Drawer"
      width="530"
    >
      <a-descriptions title="信息">
        <a-descriptions-item :span="3" label="日期">
          {{ currentDay.day.format('YYYY-MM-DD') }} {{ currentDay.dayOfWeek }}
        </a-descriptions-item>
        <a-descriptions-item :span="3" label="当天类型">
          <a-radio-group v-model:value="currentDay.type" button-style="solid" class="w-full flex">
            <a-radio-button :value="DayType.NORMAL">正常</a-radio-button>
            <a-radio-button :value="DayType.GROUP">团播/单人</a-radio-button>
            <a-radio-button :value="DayType.REST_DAY">休息日</a-radio-button>
            <a-radio-button :value="DayType.BLANK">空白</a-radio-button>
          </a-radio-group>
        </a-descriptions-item>
      </a-descriptions>
      <a-descriptions v-if="currentDay.type === DayType.NORMAL && currentEarlyLive" title="早场">
        <a-descriptions-item :span="3" label="早场时间">
          <a-time-picker v-model:value="currentEarlyLive.startingTime" :allowClear="false"
                         format="HH:mm"/>
        </a-descriptions-item>
        <a-descriptions-item :span="3" label="早场直播间">
          <a-radio-group v-model:value="customEarlyVtuberType" button-style="solid"
                         class="w-full flex">
            <a-radio-button :value="VtuberType.LIAN">{{ VtuberType.LIAN }}</a-radio-button>
            <a-radio-button :value="VtuberType.QUEENIE">{{ VtuberType.QUEENIE }}</a-radio-button>
            <a-radio-button :value="VtuberType.BEKKI">{{ VtuberType.BEKKI }}</a-radio-button>
            <a-radio-button :value="VtuberType.YOYI">{{ VtuberType.YOYI }}</a-radio-button>
            <a-radio-button :value="VtuberType.CUSTOM">{{ VtuberType.CUSTOM }}</a-radio-button>
          </a-radio-group>
        </a-descriptions-item>
        <a-descriptions-item v-if="customEarlyVtuberType === VtuberType.CUSTOM" :span="3"
                             label="自定义内容">
          <a-textarea v-model:value="currentEarlyLive.content"
                      class="w-full mt-2" placeholder="请输入自定义内容"/>
        </a-descriptions-item>
        <a-descriptions-item v-if="customEarlyVtuberType === VtuberType.CUSTOM" :span="3"
                             label="自定义图标">
          <a-radio-group v-model:value="currentEarlyLive.icon" class="w-full flex">
            <a-radio-button
              v-for="([key, value]) in Object.entries(IconType)"
              :key="key"
              :value="value">
              {{ value }}
            </a-radio-button>
          </a-radio-group>
        </a-descriptions-item>
        <a-descriptions-item :span="3" label="内容字体大小">
          <div class="flex justify-center items-center w-full">
            <a-slider v-model:value="currentEarlyLive.fontSize" :max="6" :min="2"
                      :step="0.25" class="w-3/5"/>
            <a-input-number v-model:value="currentEarlyLive.fontSize" :max="6" :min="2"
                            addon-after="vh"
                            class="w-2/5 ml-4"/>
          </div>
        </a-descriptions-item>
      </a-descriptions>
      <a-descriptions v-if="currentDay.type === DayType.NORMAL && currentLateLive" title="晚场">
        <a-descriptions-item :span="3" label="晚场时间">
          <a-time-picker v-model:value="currentLateLive.startingTime" :allowClear="false"
                         format="HH:mm"/>
        </a-descriptions-item>
        <a-descriptions-item :span="3" label="晚场直播间">
          <a-radio-group v-model:value="customLateVtuberType" button-style="solid"
                         class="w-full flex">
            <a-radio-button :value="VtuberType.LIAN">{{ VtuberType.LIAN }}</a-radio-button>
            <a-radio-button :value="VtuberType.QUEENIE">{{ VtuberType.QUEENIE }}</a-radio-button>
            <a-radio-button :value="VtuberType.BEKKI">{{ VtuberType.BEKKI }}</a-radio-button>
            <a-radio-button :value="VtuberType.YOYI">{{ VtuberType.YOYI }}</a-radio-button>
            <a-radio-button :value="VtuberType.CUSTOM">{{ VtuberType.CUSTOM }}</a-radio-button>
          </a-radio-group>
        </a-descriptions-item>
        <a-descriptions-item v-if="customLateVtuberType === VtuberType.CUSTOM" :span="3"
                             label="自定义内容">
          <a-textarea v-model:value="currentLateLive.content"
                      class="w-full mt-2" placeholder="请输入自定义内容"/>
        </a-descriptions-item>
        <a-descriptions-item v-if="customLateVtuberType === VtuberType.CUSTOM" :span="3"
                             label="自定义图标">
          <a-radio-group v-model:value="currentLateLive.icon" class="w-full flex">
            <a-radio-button
              v-for="([key, value]) in Object.entries(IconType)"
              :key="key"
              :value="value">
              {{ value }}
            </a-radio-button>
          </a-radio-group>
        </a-descriptions-item>
        <a-descriptions-item :span="3" label="内容字体大小">
          <div class="flex justify-center items-center w-full">
            <a-slider v-model:value="currentLateLive.fontSize" :max="6" :min="2"
                      :step="0.1" class="w-3/5"/>
            <a-input-number v-model:value="currentLateLive.fontSize" :max="6" :min="2"
                            addon-after="vh"
                            class="w-2/5 ml-4"/>
          </div>
        </a-descriptions-item>
      </a-descriptions>
      <a-descriptions v-if="currentDay.type === DayType.GROUP" title="团播">
        <a-descriptions-item :span="3" label="直播间图标">
          <a-radio-group v-model:value="currentDay.group.icon"
                         class="w-full flex">
            <a-radio-button
              v-for="([key, value]) in Object.entries(IconType)"
              :key="key"
              :value="value">
              {{ value }}
            </a-radio-button>
          </a-radio-group>
        </a-descriptions-item>
        <a-descriptions-item :span="3" label="时间">
          <a-time-picker v-model:value="currentDay.group.startingTime"
                         :allowClear="false" format="HH:mm"/>
        </a-descriptions-item>
        <a-descriptions-item :span="3" label="内容字体大小">
          <div class="flex justify-center items-center w-full">
            <a-slider v-model:value="currentDay.group.fontSize" :max="6" :min="2"
                      :step="0.1"
                      class="w-3/5"/>
            <a-input-number v-model:value="currentDay.group.fontSize" :max="6"
                            :min="2"
                            addon-after="vh" class="w-2/5 ml-4"/>
          </div>
        </a-descriptions-item>
        <a-descriptions-item
          :span="3" label="自定义内容">
          <a-textarea v-model:value="currentDay.group.content"
                      :auto-size="{ minRows: 3}"
                      placeholder="请输入直播间内容"/>
        </a-descriptions-item>
      </a-descriptions>

      <a-descriptions title="其他">
        <a-descriptions-item :span="3">
          <a-button class="mr-3" type="primary" @click="downloadScreenshot()">
            <template #icon>
              <!--suppress HtmlUnknownTag -->
              <DownloadOutlined/>
            </template>
            下载周表图片
          </a-button>
          <a-tag color="orange">浏览器窗口过大会导致截图边框出现缝隙</a-tag>
        </a-descriptions-item>
        <a-descriptions-item :span="3">
          <pre>{{ JSON.stringify(currentDay, null, 2) }}</pre>
        </a-descriptions-item>
      </a-descriptions>
      <a-divider/>
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
