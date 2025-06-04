import dayjs from "dayjs";
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

  toJSON() {
    // noinspection SpellCheckingInspection
    return {
      day: this.day.format('YYYY-MM-DD'),
      date: this.date,
      dayOfWeek: this.dayOfWeek,
      type: this.type,
      early: this.early.toJSON(),
      late: this.late.toJSON(),
      group: this.group.toJSON(),
    }
  }

  static fromJSON(obj: any) {
    const day = new Day(dayjs(obj.day))
    day.date = obj.date
    day.dayOfWeek = obj.dayOfWeek
    day.type = obj.type
    day.early = Live.fromJSON(obj.early)
    day.late = Live.fromJSON(obj.late)
    day.group = Group.fromJSON(obj.group)
    return day
  }
}
