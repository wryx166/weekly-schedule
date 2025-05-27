import { defineStore } from "pinia";
import { ScheduleDataList } from "@/data.ts";

export const useScheduleStore = defineStore("schedule", {
  state: () => ({
    randomData: new ScheduleDataList(),
  }),
  actions: {
    updateRandomData(data: ScheduleDataList) {
      this.randomData = data;
    },
  },
});
