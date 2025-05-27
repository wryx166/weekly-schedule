import dayjs from 'dayjs'

export const SessionType = {
  EARLY: 'early', // 早场
  LATE: 'late', // 晚场
  GROUP_BROADCASTING: 'groupBroadcasting', // 集体直播
}

export const DayType = {
  NORMAL: 'normal', // 普通日
  REST_DAY: 'restDay', // 休息日
  GROUP_BROADCASTING: 'groupBroadcasting', // 集体直播
}

export const VtuberType = {
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
  constructor (time, vtuberName) {
    this.startingTime = time
    this.vtuberName = vtuberName
    this.customContent = '团播'
    this.customFontSize = 3
  }
}

// 单独的时间段
class Live {
  constructor (time) {
    this.startingTime = time
    this.vtuberName = vtuberListEn[Math.floor(Math.random() * vtuberListEn.length)]
    this.customContent = ''
    this.type = 'normal' // normal, custom
    this.customFontSize = 3
  }

  handleVtuberClick () {
    console.log('Clicked session:', this)
    const nextVTuber = getNextVTuber(this.vtuberName)
    console.log('下一个 VTuber 是:', nextVTuber)
    this.vtuberName = nextVTuber
  }
}

export const dayClassToChinese = {
  sunday: '周日',
  monday: '周一',
  tuesday: '周二',
  wednesday: '周三',
  thursday: '周四',
  friday: '周五',
  saturday: '周六',
}

class Day {
  constructor (day) {
    this.day = day
    this.date = day.format('MM.DD')
    this.dayOfWeek = dayClassToChinese[daysOfWeek[day.day()]]
    this.type = DayType.NORMAL // normal, restDay, groupBroadcasting
    this[SessionType.EARLY] = new Live(day.clone().hour(18).minute(30))
    this[SessionType.LATE] = new Live(day.clone().hour(21).minute(0))
    this.groupBroadcasting = new GroupBroadcasting(day.clone().hour(19).minute(30), this[SessionType.EARLY].vtuberName)
  }
}

export class ScheduleDataList {
  constructor () {
    this.init()
  }

  init () {
    // noinspection JSUnusedGlobalSymbols
    this.dateRange = new dayjs()
    let start = new dayjs()
    const days = []
    for (let i = 0; i < 7; i++) {
      days.push(new Day(start))
      start = start.add(1, 'day')
    }
    this.data = days
  }

  updateDateRange (newDateRange) {
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

  getDayOfWeek (day) {
    return dayClassToChinese[daysOfWeek[day.day()]]
  }
}

class CircularQueue {
  items = []

  constructor (items) {
    this.items = [...items]
  }

  getNext (value) {
    const index = this.items.indexOf(value)
    if (index === -1) return undefined // 值不存在于队列中

    const nextIndex = (index + 1) % this.items.length
    return this.items[nextIndex]
  }
}

const getNextVTuber = (() => {
  const queue = new CircularQueue(vtuberListEn)
  return (vtuber) => queue.getNext(vtuber)
})()
