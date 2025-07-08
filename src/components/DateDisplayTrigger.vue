<script lang="ts" setup>
import { computed, ref } from "vue";
import dayjs from "dayjs";
const open = ref(false);
const tmpValue = ref<dayjs.Dayjs>();
const firstDay = defineModel<dayjs.Dayjs>("firstDay", {
  required: true,
});

const showModal = () => {
  open.value = true;
  tmpValue.value = firstDay.value;
};

const handleOk = () => {
  if (!tmpValue.value) return;
  firstDay.value = tmpValue.value;
  open.value = false;
};
const dateRangeText = computed(() => {
  const start = firstDay.value;
  const end = start.add(6, "day");
  return `${start.format("YYYY.MM.DD")}-${end.format("YYYY.MM.DD")}`;
});
</script>

<template>
  <div class="h-full w-full">
    <time
      class="date-range ml-[1%] flex w-full items-center justify-center text-center font-[AlibabaPuHuiTi-3-75-SemiBold] text-[3.5vh] text-sxwz-light"
      @click="showModal()"
    >
      {{ dateRangeText }}
    </time>
    <a-modal v-model:open="open" title="Basic Modal" @ok="handleOk">
      <a-date-picker v-model:value="tmpValue" :allowClear="false" />
    </a-modal>
  </div>
</template>

<style scoped></style>
