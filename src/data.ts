import dayjs from 'dayjs'


export const DayType = {
  NORMAL: 'normal', // 普通日
  REST_DAY: 'restDay', // 休息日
  GROUP_BROADCASTING: 'groupBroadcasting', // 集体直播
}

export const VtuberType: { [key: string]: string } = {
  queenie: '沐霂',
  lian: '梨安',
  bekki: '恬豆',
  yoyi: '又一',
}

const vtuberListEn = ['lian', 'queenie', 'bekki', 'yoyi']
const daysOfWeek = [
  'sunday',
  'monday',
  'tuesday',
  'wednesday',
  'thursday',
  'friday',
  'saturday',
]

class GroupBroadcasting {
  startingTime: dayjs.Dayjs
  vtuberName: string
  customContent: string
  customFontSize: number


  constructor(time: dayjs.Dayjs, vtuberName: string) {
    this.startingTime = time
    this.vtuberName = vtuberName
    this.customContent = '团播'
    this.customFontSize = 4.75
  }
}

// 单独的时间段
export class Live {
  startingTime: dayjs.Dayjs
  vtuberName: string
  customContent: string
  type: string
  customFontSize: number


  constructor(time: dayjs.Dayjs) {
    this.startingTime = time
    this.vtuberName = vtuberListEn[Math.floor(Math.random() * vtuberListEn.length)]
    this.customContent = ''
    this.type = 'normal' // normal, custom
    this.customFontSize = 4.75
  }

  handleVtuberClick() {
    console.log('Clicked session:', this)
    const nextVTuber: string = getNextVTuber(this.vtuberName)
    console.log('下一个 VTuber 是:', nextVTuber)
    this.vtuberName = nextVTuber
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
  type: string // normal, restDay, groupBroadcasting
  early: Live
  late: Live
  groupBroadcasting: GroupBroadcasting

  constructor(day: dayjs.Dayjs) {
    this.day = day
    this.date = day.format('MM.DD')
    this.dayOfWeek = dayClassToChinese[daysOfWeek[day.day()]]
    this.type = DayType.NORMAL // normal, restDay, groupBroadcasting
    this.early = new Live(day.clone().hour(18).minute(30))
    this.late = new Live(day.clone().hour(21).minute(0))
    this.groupBroadcasting = new GroupBroadcasting(day.clone().hour(19).minute(30), this.early.vtuberName)
  }
}

export class ScheduleDataList {
  dateRange: dayjs.Dayjs
  data: Day[]

  constructor() {
    this.dateRange = dayjs()
    let start = dayjs()
    const days = []
    for (let i = 0; i < 7; i++) {
      days.push(new Day(start))
      start = start.add(1, 'day')
    }
    this.data = days
  }

  updateDateRange(newDateRange: dayjs.Dayjs) {
    // noinspection JSUnusedGlobalSymbols
    this.dateRange = newDateRange
    let start = dayjs(newDateRange)
    for (let i = 0; i < 7; i++) {
      const dayData = this.data[i]
      if (dayData) {
        dayData.date = start.format('MM.DD')
        dayData.dayOfWeek = this.getDayOfWeek(start)
      }
      start = start.add(1, 'day')
    }
  }

  getDayOfWeek(day: dayjs.Dayjs): string {
    return dayClassToChinese[daysOfWeek[day.day()]]
  }
}

class CircularQueue {
  items: string[]

  constructor(items: string[]) {
    this.items = [...items]
  }

  getNext(value: string): string {
    const index = this.items.indexOf(value)
    if (index === -1) {
      throw new Error(`Value "${value}" not found in the queue.`)
    }
    const nextIndex = (index + 1) % this.items.length
    return this.items[nextIndex]
  }
}

const getNextVTuber: (vtuber: string) => string = (() => {
  const queue = new CircularQueue(vtuberListEn)
  return (vtuber: string) => queue.getNext(vtuber)
})()
