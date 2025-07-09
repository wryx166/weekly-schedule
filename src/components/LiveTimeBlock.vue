<script lang="ts" setup>
import { IconType } from "@/data.ts";
import { Live } from "@/models/Live.ts";
import { Group } from "@/models/Group.ts";

const startingTimeText = (live: Live | Group) => {
  return live.startingTime;
};

const live = defineModel<Live | Group>("live", { required: true });

// 映射，梨 => lian
const VtuberIconToEN: { [key: string]: string } = {
  [IconType.QUEENIE]: "queenie",
  [IconType.LIAN]: "lian",
  [IconType.BEKKI]: "bekki",
  [IconType.YOYI]: "yoyi",
  [IconType.NULL]: "null",
};
</script>

<template>
  <div class="relative flex flex-1 flex-col items-center justify-center gap-1 only:gap-4">
    <!-- 时间 -->
    <div class="font-display text-[4.75vh] leading-[5vh] text-sxwz select-none">
      {{ startingTimeText(live) }}
    </div>
    <div
      :style="{ fontSize: `${live.fontSize}vh` }"
      class="text-center font-display leading-[5vh] text-sxwz select-none"
      v-html="live.content.replace(/ /g, '&nbsp;').replace(/\n/g, '<br>')"
    />
    <div :key="live.icon" :class="VtuberIconToEN[live.icon]" class="icon" />
  </div>
</template>

<style scoped></style>
