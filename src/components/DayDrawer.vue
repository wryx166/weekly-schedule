<script lang="ts" setup>

import {DayType, IconType, LiveType, VtuberType, VtuberTypeToIcon} from "@/data.ts";
import {DownloadOutlined} from "@ant-design/icons-vue";
import {Day} from "@/models/Day.ts";
import {ref, watch} from "vue";
import {Live} from "@/models/Live.ts";
// noinspection SpellCheckingInspection
import domtoimage from "dom-to-image";

const currentDay = defineModel<Day>('currentDay', {required: true})
const openDrawer = defineModel<boolean>('openDrawer', {required: true})
const customEarlyVtuberType = ref()
const customLateVtuberType = ref()
watch(
  () => currentDay.value,
  (day) => {
    if (!day) return
    customEarlyVtuberType.value = day.early.type === LiveType.NORMAL ? day.early.content : VtuberType.CUSTOM
    customLateVtuberType.value = day.late.type === LiveType.NORMAL ? day.late.content : VtuberType.CUSTOM
  },
  {immediate: true}
)

watch(customEarlyVtuberType, (val) => {
  updateLiveType(currentDay.value.early, val)
})


watch(customLateVtuberType, (val) => {
  updateLiveType(currentDay.value.late, val)
})

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
</script>

<template>
  <a-drawer
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
    <a-descriptions v-if="currentDay.type === DayType.NORMAL" title="早场">
      <a-descriptions-item :span="3" label="早场时间">
        <a-time-picker v-model:value="currentDay.early.startingTime" :allowClear="false"
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
      <template v-if="customEarlyVtuberType === VtuberType.CUSTOM">
        <a-descriptions-item :span="3" label="自定义内容">
          <a-textarea v-model:value="currentDay.early.content"
                      class="w-full mt-2" placeholder="请输入自定义内容"/>
        </a-descriptions-item>
        <a-descriptions-item :span="3" label="自定义图标">
          <a-radio-group v-model:value="currentDay.early.icon" class="w-full flex">
            <a-radio-button
              v-for="([key, value]) in Object.entries(IconType)"
              :key="key"
              :value="value">
              {{ value }}
            </a-radio-button>
          </a-radio-group>
        </a-descriptions-item>
      </template>
      <a-descriptions-item :span="3" label="内容字体大小">
        <div class="flex justify-center items-center w-full">
          <a-slider v-model:value="currentDay.early.fontSize" :max="6" :min="2"
                    :step="0.25" class="w-3/5"/>
          <a-input-number v-model:value="currentDay.early.fontSize" :max="6" :min="2"
                          addon-after="vh"
                          class="w-2/5 ml-4"/>
        </div>
      </a-descriptions-item>
    </a-descriptions>
    <a-descriptions v-if="currentDay.type === DayType.NORMAL" title="晚场">
      <a-descriptions-item :span="3" label="晚场时间">
        <a-time-picker v-model:value="currentDay.late.startingTime" :allowClear="false"
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
      <template v-if="customLateVtuberType === VtuberType.CUSTOM">
        <a-descriptions-item :span="3"
                             label="自定义内容">
          <a-textarea v-model:value="currentDay.late.content"
                      class="w-full mt-2" placeholder="请输入自定义内容"/>
        </a-descriptions-item>
        <a-descriptions-item :span="3"
                             label="自定义图标">
          <a-radio-group v-model:value="currentDay.late.icon" class="w-full flex">
            <a-radio-button
              v-for="([key, value]) in Object.entries(IconType)"
              :key="key"
              :value="value">
              {{ value }}
            </a-radio-button>
          </a-radio-group>
        </a-descriptions-item>
      </template>
      <a-descriptions-item :span="3" label="内容字体大小">
        <div class="flex justify-center items-center w-full">
          <a-slider v-model:value="currentDay.late.fontSize" :max="6" :min="2"
                    :step="0.1" class="w-3/5"/>
          <a-input-number v-model:value="currentDay.late.fontSize" :max="6" :min="2"
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
        <pre>{{ JSON.stringify(currentDay.toJSON(), null, 2) }}</pre>
      </a-descriptions-item>
    </a-descriptions>
    <a-divider/>
  </a-drawer>
</template>

<style scoped>

</style>
