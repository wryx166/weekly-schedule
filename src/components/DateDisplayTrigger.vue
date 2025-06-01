<script lang="ts" setup>
import {computed, ref} from "vue";
import dayjs from "dayjs";
const open = ref(false);
const value1 = ref();
const firstDay= defineModel<dayjs.Dayjs>('firstDay');

const showModal = () => {
  open.value = true;
  value1.value = firstDay.value;
};

const handleOk = () => {
  if (!value1.value) return;
  firstDay.value = value1.value;
  open.value = false;
};
const dateRangeText = computed(() => {
  const start = firstDay.value;
  if (!start) throw  new Error("Invalid start date");
  const end = start.add(6, "day");
  return `${start.format("YYYY.MM.DD")}-${end.format("YYYY.MM.DD")}`;
});
</script>

<template>
  <div :class="$attrs.class" class="flex items-center justify-center">
    <time
      class="date-range ml-[1%] text-sxwz-light w-full text-center text-[3.5vh] font-[AlibabaPuHuiTi-3-75-SemiBold]"
      @click="showModal()"
    >
      {{ dateRangeText }}
    </time>
  </div>
  <a-modal v-model:open="open" title="Basic Modal" @ok="handleOk">
    <a-date-picker v-model:value="value1" :allowClear="false"/>
  </a-modal>
</template>

<style scoped></style>
