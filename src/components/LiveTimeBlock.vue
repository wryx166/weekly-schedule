<script lang="ts" setup>
import { LiveType, VtuberIconToEN } from "@/data.ts";
import { Live } from "@/models/Live.ts";
import { Group } from "@/models/Group.ts";

const startingTimeText = (live: Live | Group) => {
  return live.startingTime.format("HH:mm");
};

const live = defineModel<Live | Group>("live", { required: true });
</script>

<template>
  <div class="relative flex flex-1 flex-col items-center justify-center">
    <div class="font-display text-[4.75vh] leading-[5vh] text-sxwz select-none">
      {{ startingTimeText(live) }}
    </div>
    <div
      v-if="live.type !== LiveType.CUSTOM"
      :key="`${live.content}`"
      :style="{ fontSize: `${live.fontSize}vh` }"
      class="font-display leading-[5vh] text-sxwz select-none"
    >
      {{ live.content }}
    </div>
    <div
      v-else
      :key="`${live.content}-${live.content}`"
      :style="{ fontSize: `${live.fontSize}vh` }"
      class="text-center font-display leading-[5vh] text-sxwz select-none"
      v-html="live.content.replace(/ /g, '&nbsp;').replace(/\n/g, '<br>')"
    />

    <div :key="live.icon" :class="VtuberIconToEN[live.icon]" class="icon" />
  </div>
</template>

<style scoped></style>
