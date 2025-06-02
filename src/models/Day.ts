import dayjs from "dayjs";
import {ref, type Ref} from "vue";
import {DayType} from "@/data.ts";
import {Live} from "@/models/Live.ts";
import {Group} from "@/models/Group.ts";

export class Day {
  day: dayjs.Dayjs
  date: string
  dayOfWeek: string
  type: DayType // normal, restDay, group
  early: Live
  late: Live
  group: Group

  constructor(day: dayjs.Dayjs) {
    this.day = day
    this.date = day.format('MM.DD')
    this.dayOfWeek = day.format('ddd')
    this.type = DayType.NORMAL // normal, restDay, group
    this.early = new Live(day.clone().hour(18).minute(30))
    this.late = new Live(day.clone().hour(21).minute(0))
    this.group = new Group(day.clone().hour(19).minute(30), this.early.icon)
  }

  static initDayList(start: dayjs.Dayjs = dayjs()): Ref<Day[]> {
    const days = ref<Day[]>([])
    for (let i = 0; i < 7; i++) {
      days.value.push(new Day(start.add(i, 'day')))
    }
    return days
  }
}
