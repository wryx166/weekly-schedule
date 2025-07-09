<script lang="ts" setup>
import { DayType, Liver, LiveType, VtuberTypeToIcon } from "@/data.ts";
import { DownloadOutlined } from "@ant-design/icons-vue";
import { Day } from "@/models/Day.ts";
import { onMounted, ref, watch } from "vue";
// noinspection SpellCheckingInspection
import domtoimage from "dom-to-image";
import type { Live } from "@/models/Live.ts";
import LiveEditor from "@/components/LiveEditor.vue";
import dayjs from "dayjs";

const day = defineModel<Day>("currentDay", { required: true });
const earlyType = ref<Liver>();
const lateType = ref<Liver>();

watch(earlyType, (value) => {
  console.log("earlyType changed:", value);
  onLiveTypeChange(day.value.early, value!);
});

watch(lateType, (value) => {
  console.log("lateType changed:", value);
  onLiveTypeChange(day.value.late, value!);
});

onMounted(() => {
  earlyType.value = getButtonType(day.value.early);
  lateType.value = getButtonType(day.value.late);
});

watch(day, () => {
  earlyType.value = getButtonType(day.value.early);
  lateType.value = getButtonType(day.value.late);
});

function onLiveTypeChange(live: Live, value: Liver) {
  console.log("lateType changed:", value);
  if (value === Liver.CUSTOM) {
    // 如果选择了自定义，保留原有内容和图标
    live.type = LiveType.CUSTOM;
  } else {
    live.type = LiveType.NORMAL;
    live.content = value;
    live.icon = VtuberTypeToIcon[value];
  }
}

function getButtonType(live: Live): Liver {
  if (live.type === LiveType.CUSTOM) {
    return Liver.CUSTOM;
  }
  for (const type of Object.values(Liver)) {
    if (type === live.content) {
      return type as Liver;
    }
  }
  return Liver.CUSTOM;
}

const downloadScreenshot = () => {
  const mainDiv = document.querySelector("div.main");
  if (!mainDiv) {
    alert("未找到 .main 区域");
    return;
  }
  domtoimage
    .toPng(mainDiv)
    .then(function (dataUrl) {
      const link = document.createElement("a");
      link.href = dataUrl;
      link.download = "screenshot.png";
      link.click();
    })
    .catch(function (error) {
      alert("截图失败: " + error);
    });
};

const handleReset = () => {
  localStorage.clear();
  window.location.reload();
};
</script>

<template>
  <a-descriptions title="信息">
    <a-descriptions-item :span="3" label="日期">
      {{ dayjs(day.day).format("YYYY-MM-DD") }} {{ day.dayOfWeek }}
    </a-descriptions-item>
    <a-descriptions-item :span="3" label="当天类型">
      <a-radio-group v-model:value="day.type" button-style="solid" class="flex w-full">
        <a-radio-button :value="DayType.NORMAL">正常</a-radio-button>
        <a-radio-button :value="DayType.GROUP">团播/单人</a-radio-button>
        <a-radio-button :value="DayType.REST_DAY">休息日</a-radio-button>
        <a-radio-button :value="DayType.BLANK">空白</a-radio-button>
      </a-radio-group>
    </a-descriptions-item>
  </a-descriptions>
  <LiveEditor
    v-if="day.type === DayType.NORMAL"
    v-model:live="day.early"
    v-model:live-type="earlyType"
    title="早场"
  />
  <LiveEditor
    v-if="day.type === DayType.NORMAL"
    v-model:live="day.late"
    v-model:live-type="lateType"
    title="晚场"
  />
  <LiveEditor v-if="day.type === DayType.GROUP" v-model:live="day.group" title="团播" />

  <a-descriptions title="其他">
    <a-descriptions-item :span="3">
      <a-button class="mr-3" type="primary" @click="downloadScreenshot()">
        <template #icon>
          <!--suppress HtmlUnknownTag -->
          <DownloadOutlined />
        </template>
        下载周表图片
      </a-button>
      <a-tag color="orange">截图边框可能出现缝隙</a-tag>
      <a-popconfirm
        title="确定要重置所有内容吗？"
        ok-text="Yes"
        cancel-text="No"
        @confirm="handleReset"
      >
        <a-button danger class="ml-auto">重置</a-button>
      </a-popconfirm>
    </a-descriptions-item>
    <a-descriptions-item :span="3">
      <pre>{{ JSON.stringify(day, null, 2) }}</pre>
    </a-descriptions-item>
  </a-descriptions>
  <a-divider />
</template>

<style scoped></style>
