<script setup>
import { computed, onMounted, ref } from "vue";
import { SessionType } from "@/data.js";
import { useScheduleStore } from "@/store/scheduleStore.js";
import dayjs from "dayjs";

const scheduleStore = useScheduleStore();
const randomData = ref(scheduleStore.randomData);
const open = ref(false);

const timePicker = ref();
const currentLive = ref(null);

class TimePickerDialog {
  constructor(open = false, value = null, currentLive = null) {
    this.open = open;
    this.value = value;
    this.currentLive = currentLive;
  }
}
const timePickerDialog = ref(new TimePickerDialog());
const confirmTimePicker = () => {
  timePickerDialog["value"].currentLive.startingTime =
    timePickerDialog["value"].value;
  timePickerDialog["value"].open = false;
  timePickerDialog["value"].value = null;
};
onMounted(() => {
  scheduleStore.updateRandomData(randomData);
});

const openTimePicker = (live) => {
  console.log("Starting time clicked");
  timePickerDialog["value"].currentLive = live;
  timePickerDialog["value"].value = live.startingTime;
  timePickerDialog["value"].open = true;
};

function isSameHourAndMinute(time1, time2) {
  if (!time1 || !time2) throw new Error("Invalid time values provided");
  return dayjs(time1).isSame(dayjs(time2), "minute");
}

const startingTimeText = (live) => {
  return live.startingTime.format("HH:mm");
};

const okButtonProps = computed(() => {
  if (
    !timePickerDialog["value"]?.value ||
    !timePickerDialog["value"]?.currentLive?.startingTime
  )
    return {
      disabled: true,
    };
  return {
    disabled: isSameHourAndMinute(
      timePickerDialog["value"].value,
      timePickerDialog["value"].currentLive.startingTime,
    ),
  };
});
</script>

<template>
  <div :class="$attrs.class">
    <div
      v-for="(daySchedule, index) in randomData.data"
      :key="index"
      class="flex w-1/7 h-full flex-col divide-y-4 divide-sxwz"
    >
      <div class="flex h-[26.66%] w-full flex-col items-center">
        <div class="h-[13%]" />
        <div
          class="h-[38%] text-sxwz text-[3.5vh] font-display items-center flex justify-center"
        >
          {{ randomData.data[index].dayOfWeek }}
        </div>
        <div class="h-[14.7%]" />
        <time
          class="day text-sxwz-light text-[3vh] font-display h-[21%] items-center flex justify-center"
        >
          {{ randomData.data[index].date }}
        </time>
      </div>

      <div class="flex-grow flex w-full flex-col divide-y-4 divide-sxwz">
        <div
          v-for="(live, timeKey) in {
            [SessionType.EARLY]: daySchedule[SessionType.EARLY],
            [SessionType.LATE]: daySchedule[SessionType.LATE],
          }"
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
</template>

<style scoped>
.icon-blur-enter-active,
.icon-blur-leave-active {
  transition:
    filter 0.15s ease,
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
