<script setup>
import { onMounted, ref, watch } from 'vue'
import { DayType, SessionType, VtuberType } from '@/data.js'
import { useScheduleStore } from '@/store/scheduleStore.js'
import { DownloadOutlined } from '@ant-design/icons-vue'
import domtoimage from 'dom-to-image'

const scheduleStore = useScheduleStore()
const randomData = ref(scheduleStore.randomData)
const openDrawer = ref(false)
const currentDay = ref(null)
const customEarlyVtuberType = ref('')
const customLateVtuberType = ref('')

onMounted(() => {
  scheduleStore.updateRandomData(randomData)
})

const startingTimeText = (live) => {
  return live.startingTime.format('HH:mm')
}

const afterOpenChange = (bool) => {
  console.log('open', bool)
}

const showDrawer = (day) => {
  openDrawer.value = true
  currentDay.value = day
  if (day.early.type !== 'custom') {
    customEarlyVtuberType.value = day.early.vtuberName
  } else {
    customEarlyVtuberType.value = 'custom'
  }

  if (day.late.type !== 'custom') {
    customLateVtuberType.value = day.late.vtuberName
  } else {
    customLateVtuberType.value = 'custom'
  }

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

// 监听 vtuberName，如果切换到自定义，自动填充输入框
watch(customEarlyVtuberType, (val) => {
  console.log('customEarlyVtuberType', val)
  if (val !== 'custom') {
    currentDay.value.early.type = 'normal'
    currentDay.value.early.customContent = VtuberType[val]
    currentDay.value.early.vtuberName = val
  } else {
    currentDay.value.early.type = 'custom'
  }
})
watch(customLateVtuberType, (val) => {
  console.log('customLateVtuberType', val)
  if (val !== 'custom') {
    currentDay.value.late.type = 'normal'
    currentDay.value.late.customContent = VtuberType[val]
    currentDay.value.late.vtuberName = val
  } else {
    currentDay.value.late.type = 'custom'
  }
})
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
              class="h-[50%] flex flex-col items-center justify-center relative"
          >
            <div
                class="text-sxwz text-[3vh] font-display select-none"
                @click="showDrawer(daySchedule)"
            >
              {{ startingTimeText(live) }}
            </div>
            <transition mode="out-in" name="icon-blur">
              <div
                  v-if="live.type !== 'custom'"
                  :key="`${live.vtuberName}-${timeKey}`"
                  :style="{ fontSize: `${live.customFontSize}vh` }"
                  class="text-sxwz font-display select-none"
                  @click="live.handleVtuberClick()"
              >
                {{ VtuberType[live.vtuberName] }}
              </div>
              <div v-else
                   :key="`${live.customContent}-${timeKey}`"
                   :style="{ fontSize: `${live.customFontSize}vh` }"
                   class="text-sxwz font-display select-none text-center"
                   v-html="live.customContent.replace(/ /g, '&nbsp;').replace(/\n/g, '<br>')"/>
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
                  :style="{ fontSize: `${currentDay.groupBroadcasting.customFontSize}vh` }"
                  class="text-sxwz font-display select-none text-center"
                  v-html="daySchedule.groupBroadcasting.customContent.replace(/ /g, '&nbsp;').replace(/\n/g, '<br>')"
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
    <a-drawer
        v-model:open="openDrawer"
        :root-style="{ color: 'blue' }"
        placement="right"
        root-class-name="root-class-name"
        title="Basic Drawer"
        width="530"
        @after-open-change="afterOpenChange"
    >
      <a-descriptions title="信息">
        <a-descriptions-item :span="3" label="日期">
          {{ currentDay.day.format('YYYY-MM-DD') }} {{ currentDay.dayOfWeek }}
        </a-descriptions-item>
        <a-descriptions-item :span="3" label="当天类型">
          <a-radio-group v-model:value="currentDay.type" button-style="solid" class="w-full flex">
            <a-radio-button value="normal">正常</a-radio-button>
            <a-radio-button value="groupBroadcasting">团播/单人</a-radio-button>
            <a-radio-button value="restDay">休息日</a-radio-button>
            <a-radio-button value="null">空白</a-radio-button>
          </a-radio-group>
        </a-descriptions-item>
      </a-descriptions>
      <a-descriptions v-if="currentDay.type === DayType.NORMAL" title="早场">
        <a-descriptions-item :span="3" label="早场时间">
          <a-time-picker v-model:value="currentDay['early'].startingTime" :allowClear="false" format="HH:mm"/>
        </a-descriptions-item>
        <a-descriptions-item :span="3" label="早场直播间">
          <a-radio-group v-model:value="customEarlyVtuberType" button-style="solid" class="w-full flex">
            <a-radio-button value="lian">梨安</a-radio-button>
            <a-radio-button value="queenie">沐霂</a-radio-button>
            <a-radio-button value="bekki">恬豆</a-radio-button>
            <a-radio-button value="yoyi">又一</a-radio-button>
            <a-radio-button value="custom">自定义</a-radio-button>
          </a-radio-group>
        </a-descriptions-item>
        <a-descriptions-item v-if="customEarlyVtuberType === 'custom'" :span="3" label="自定义内容">
          <a-textarea v-model:value="currentDay['early'].customContent"
                      class="w-full mt-2" placeholder="请输入自定义内容"/>
        </a-descriptions-item>
        <a-descriptions-item v-if="customEarlyVtuberType === 'custom'" :span="3" label="自定义图标">
          <a-radio-group v-model:value="currentDay['early'].vtuberName" class="w-full flex">
            <a-radio-button value="lian">梨</a-radio-button>
            <a-radio-button value="queenie">沐</a-radio-button>
            <a-radio-button value="bekki">恬</a-radio-button>
            <a-radio-button value="yoyi">又</a-radio-button>
            <a-radio-button value="custom">不显示</a-radio-button>
          </a-radio-group>
        </a-descriptions-item>
        <a-descriptions-item :span="3" label="内容字体大小">
          <div class="flex justify-center items-center w-full">
            <a-slider v-model:value="currentDay['early'].customFontSize" :max="6" :min="2" :step="0.1" class="w-3/5"/>
            <a-input-number v-model:value="currentDay['early'].customFontSize" :max="6" :min="2" addon-after="vh"
                            class="w-2/5 ml-4"/>
          </div>
        </a-descriptions-item>
      </a-descriptions>
      <a-descriptions v-if="currentDay.type === DayType.NORMAL" title="晚场">
        <a-descriptions-item :span="3" label="晚场时间">
          <a-time-picker v-model:value="currentDay['late'].startingTime" :allowClear="false" format="HH:mm"/>
        </a-descriptions-item>
        <a-descriptions-item :span="3" label="晚场直播间">
          <a-radio-group v-model:value="customLateVtuberType" button-style="solid" class="w-full flex">
            <a-radio-button value="lian">梨安</a-radio-button>
            <a-radio-button value="queenie">沐霂</a-radio-button>
            <a-radio-button value="bekki">恬豆</a-radio-button>
            <a-radio-button value="yoyi">又一</a-radio-button>
            <a-radio-button value="custom">自定义</a-radio-button>
          </a-radio-group>
        </a-descriptions-item>
        <a-descriptions-item v-if="customLateVtuberType === 'custom'" :span="3" label="自定义内容">
          <a-textarea v-model:value="currentDay['late'].customContent"
                      class="w-full mt-2" placeholder="请输入自定义内容"/>
        </a-descriptions-item>
        <a-descriptions-item v-if="customLateVtuberType === 'custom'" :span="3" label="自定义图标">
          <a-radio-group v-model:value="currentDay['late'].vtuberName" class="w-full flex">
            <a-radio-button value="lian">梨</a-radio-button>
            <a-radio-button value="queenie">沐</a-radio-button>
            <a-radio-button value="bekki">恬</a-radio-button>
            <a-radio-button value="yoyi">又</a-radio-button>
            <a-radio-button value="custom">不显示</a-radio-button>
          </a-radio-group>
        </a-descriptions-item>
        <a-descriptions-item :span="3" label="内容字体大小">
          <div class="flex justify-center items-center w-full">
            <a-slider v-model:value="currentDay['late'].customFontSize" :max="6" :min="2" :step="0.1" class="w-3/5"/>
            <a-input-number v-model:value="currentDay['late'].customFontSize" :max="6" :min="2" addon-after="vh"
                            class="w-2/5 ml-4"/>
          </div>
        </a-descriptions-item>
      </a-descriptions>
      <a-descriptions v-if="currentDay.type === DayType.GROUP_BROADCASTING" title="团播">
        <a-descriptions-item :span="3" label="直播间图标">
          <a-radio-group v-model:value="currentDay['groupBroadcasting'].vtuberName" class="w-full flex">
            <a-radio-button value="lian">梨</a-radio-button>
            <a-radio-button value="queenie">沐</a-radio-button>
            <a-radio-button value="bekki">恬</a-radio-button>
            <a-radio-button value="yoyi">又</a-radio-button>
            <a-radio-button value="custom">不显示</a-radio-button>
          </a-radio-group>
        </a-descriptions-item>
        <a-descriptions-item :span="3" label="时间">
          <a-time-picker v-model:value="currentDay.groupBroadcasting.startingTime" :allowClear="false" format="HH:mm"/>
        </a-descriptions-item>
        <a-descriptions-item :span="3" label="内容字体大小">
          <div class="flex justify-center items-center w-full">
            <a-slider v-model:value="currentDay.groupBroadcasting.customFontSize" :max="6" :min="2" :step="0.1" class="w-3/5"/>
            <a-input-number v-model:value="currentDay.groupBroadcasting.customFontSize" :max="6" :min="2" addon-after="vh" class="w-2/5 ml-4"/>
          </div>
        </a-descriptions-item>
        <a-descriptions-item
            :span="3" label="自定义内容">
          <a-textarea v-model:value="currentDay['groupBroadcasting'].customContent" :auto-size="{ minRows: 3}"
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
