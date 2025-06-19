<script lang="ts" setup>

import {LiveType, VtuberIconToEN} from "@/data.ts";
import {Live} from "@/models/Live.ts";
import {Group} from "@/models/Group.ts";


const startingTimeText = (live: Live | Group) => {
  return live.startingTime.format('HH:mm')
}

const live = defineModel<Live | Group>('live', {required: true})
</script>

<template>
  <div
    class="flex flex-col items-center justify-center relative"
    :class="[live instanceof Group ? 'h-full' : 'h-[50%]']"
  >
    <div
      class="text-sxwz text-[4.75vh] leading-[5vh]  font-display select-none"
    >
      {{ startingTimeText(live) }}
    </div>
    <transition mode="out-in" name="icon-blur">
      <div
        v-if="live.type !== LiveType.CUSTOM"
        :key="`${live.content}`"
        :style="{ fontSize: `${live.fontSize}vh` }"
        class="text-sxwz font-display select-none leading-[5vh] "
      >
        {{ live.content }}
      </div>
      <div v-else
           :key="`${live.content}-${live.content}`"
           :style="{ fontSize: `${live.fontSize}vh` }"
           class="text-sxwz font-display select-none text-center leading-[5vh] "
           v-html="live.content.replace(/ /g, '&nbsp;').replace(/\n/g, '<br>')"/>
    </transition>

    <transition mode="out-in" name="icon-blur">
      <div :key="live.icon" :class="VtuberIconToEN[live.icon]"
           class="icon"/>
    </transition>
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
