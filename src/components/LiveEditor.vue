<script lang="ts" setup>
import { IconType, Liver } from "@/data.ts";
import type { Live } from "@/models/Live.ts";
import type { Group } from "@/models/Group.ts";

const liveType = defineModel("liveType", { required: false });
const live = defineModel<Live | Group>("live", { required: true });
const { title } = defineProps({
  title: {
    type: String,
  },
});
</script>

<template>
  <a-descriptions :title="title">
    <a-descriptions-item :span="3" :label="`${title}时间`">
      <a-time-picker v-model:value="live.startingTime" :allowClear="false" format="HH:mm" />
    </a-descriptions-item>
    <a-descriptions-item v-if="liveType" :span="3" :label="`${title}直播间`">
      <a-radio-group v-model:value="liveType" button-style="solid" class="flex w-full">
        <a-radio-button :value="Liver.LIAN">{{ Liver.LIAN }}</a-radio-button>
        <a-radio-button :value="Liver.QUEENIE">{{ Liver.QUEENIE }} </a-radio-button>
        <a-radio-button :value="Liver.BEKKI">{{ Liver.BEKKI }}</a-radio-button>
        <a-radio-button :value="Liver.YOYI">{{ Liver.YOYI }}</a-radio-button>
        <a-radio-button :value="Liver.CUSTOM">{{ Liver.CUSTOM }}</a-radio-button>
      </a-radio-group>
    </a-descriptions-item>
    <template v-if="liveType === Liver.CUSTOM || liveType === undefined">
      <a-descriptions-item :span="3" label="自定义内容">
        <a-textarea
          v-model:value="live.content"
          class="mt-2 w-full"
          placeholder="请输入自定义内容"
        />
      </a-descriptions-item>
      <a-descriptions-item :span="3" label="自定义图标">
        <a-radio-group v-model:value="live.icon" class="flex w-full">
          <a-radio-button
            v-for="[key, value] in Object.entries(IconType)"
            :key="key"
            :value="value"
          >
            {{ value }}
          </a-radio-button>
        </a-radio-group>
      </a-descriptions-item>
    </template>
    <a-descriptions-item :span="3" label="内容字体大小">
      <div class="flex w-full items-center justify-center">
        <a-slider v-model:value="live.fontSize" :max="6" :min="2" :step="0.25" class="w-3/5" />
        <a-input-number
          v-model:value="live.fontSize"
          :max="6"
          :min="2"
          addon-after="vh"
          class="ml-4 w-2/5"
        />
      </div>
    </a-descriptions-item>
  </a-descriptions>
</template>

<style scoped></style>
