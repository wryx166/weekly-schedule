import dayjs from 'dayjs'
import {type Ref, ref} from "vue";


export const DayType = {
  NORMAL: 'normal', // 普通日
  REST_DAY: 'restDay', // 休息日
  GROUP: 'group', // 集体直播
  BLANK: 'blank', // 空白
}

export const LiveType = {
  NORMAL: 'normal', // 普通直播
  CUSTOM: 'custom', // 自定义直播
}

export const VtuberType = {
  QUEENIE: '沐霂',
  LIAN: '梨安',
  BEKKI: '恬豆',
  YOYI: '又一',
  CUSTOM: '自定义',
}

export const IconType = {
  QUEENIE: '沐',
  LIAN: '梨',
  BEKKI: '恬',
  YOYI: '又',
  NULL: '不显示',
}

export const VtuberTypeToIcon: { [key: string]: string } = {
  [VtuberType.QUEENIE]: IconType.QUEENIE,
  [VtuberType.LIAN]: IconType.LIAN,
  [VtuberType.BEKKI]: IconType.BEKKI,
  [VtuberType.YOYI]: IconType.YOYI
}

export const VtuberIconToEN: { [key: string]: string } = {
  [IconType.QUEENIE]: 'queenie',
  [IconType.LIAN]: 'lian',
  [IconType.BEKKI]: 'bekki',
  [IconType.YOYI]: 'yoyi',
  [IconType.NULL]: 'null',
}

export const daysOfWeek = [
  'sunday',
  'monday',
  'tuesday',
  'wednesday',
  'thursday',
  'friday',
  'saturday',
]

class Group {
  startingTime: dayjs.Dayjs
  icon: string
  content: string
  fontSize: number


  constructor(time: dayjs.Dayjs, vtuberName: string) {
    this.startingTime = time
    this.icon = vtuberName
    this.content = '团播'
    this.fontSize = 4.75
  }
}

// 单独的时间段
export class Live {
  startingTime: dayjs.Dayjs
  icon: string
  content: string
  type: string
  fontSize: number


  constructor(time: dayjs.Dayjs) {
    this.startingTime = time
    const vtuberTypeList = Object.values(VtuberType).filter(vtuber => vtuber !== VtuberType.CUSTOM)
    this.content = vtuberTypeList[Math.floor(Math.random() * vtuberTypeList.length)]
    this.icon = VtuberTypeToIcon[this.content]

    this.type = 'normal' // normal, custom
    this.fontSize = 4.75
  }
}

export const dayClassToChinese: { [key: string]: string } = {
  sunday: '周日',
  monday: '周一',
  tuesday: '周二',
  wednesday: '周三',
  thursday: '周四',
  friday: '周五',
  saturday: '周六',
}

export class Day {
  day: dayjs.Dayjs
  date: string
  dayOfWeek: string
  type: string // normal, restDay, group
  early: Live
  late: Live
  group: Group

  constructor(day: dayjs.Dayjs) {
    this.day = day
    this.date = day.format('MM.DD')
    this.dayOfWeek = dayClassToChinese[daysOfWeek[day.day()]]
    this.type = DayType.NORMAL // normal, restDay, group
    this.early = new Live(day.clone().hour(18).minute(30))
    this.late = new Live(day.clone().hour(21).minute(0))
    this.group = new Group(day.clone().hour(19).minute(30), this.early.icon)
  }

  static initDayList(start:dayjs.Dayjs = dayjs()): Ref<Day[]> {
    const days = ref<Day[]>([])
    for (let i = 0; i < 7; i++) {
      days.value.push(new Day(start))
      start = start.add(1, 'day')
    }
    return days
  }
}
