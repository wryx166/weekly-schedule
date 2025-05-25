import { defineStore } from "pinia";
import { ScheduleDataList } from "@/data.js";

export const useScheduleStore = defineStore("schedule", {
  state: () => ({
    randomData: new ScheduleDataList(),
  }),
  actions: {
    updateRandomData(data) {
      this.randomData = data;
    },
  },
});
