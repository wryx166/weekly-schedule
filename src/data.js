import dayjs from 'dayjs'

export const SessionType = {
  EARLY: 'early', // 早场
  LATE: 'late', // 晚场
}

const vtuberListEn = ['lian', 'queenie', 'bekki', 'yoyi', 'nobody']

const vtuberList = ['梨安', '沐霂', '恬豆', '又一']

const daysOfWeek = [
  'sunday',
  'monday',
  'tuesday',
  'wednesday',
  'thursday',
  'friday',
  'saturday',
]

// 单独的时间段
class Live {
  constructor (time) {
    this.startingTime = time
    this.rest = false
    this.customize = null
    this.fontSize = defaultFontSize

    const characters = ['梨安', '沐霂', '恬豆', '又一']
    // noinspection NonAsciiCharacters
    const classes = {
      沐霂: ['queenie', 'special-name'],
      梨安: 'lian',
      恬豆: 'bekki',
      又一: 'yoyi',
    }
    this.name = characters[Math.floor(Math.random() * characters.length)]
    this.class = classes[this.name]
  }

  handleVtuberClick () {
    console.log('Clicked session:', this)
    const nextVTuber = getNextVTuber(this.name)
    console.log('下一个 VTuber 是:', nextVTuber)
    this.updateVtuber(nextVTuber)
  }

  updateStartingTime (time) {
    if (time instanceof dayjs) {
      this.startingTime = time
    } else if (typeof time === 'string') {
      this.startingTime = dayjs(time, 'HH:mm')
    } else {
      throw new Error(
        'Invalid time format. Use a dayjs instance or a string in HH:mm format.',
      )
    }
  }

  updateVtuber (vtuberName) {
    this.name = vtuberName
    this.class = this.getClassByVtuber(vtuberName) || ''
  }

  handleStartingTimeClick () {}

  getClassByVtuber (name) {
    // noinspection NonAsciiCharacters
    const classes = {
      沐霂: ['queenie', 'special-name'],
      梨安: 'lian',
      恬豆: 'bekki',
      又一: 'yoyi',
    }
    return classes[name] || null
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

export const fontOptions = [
  {
    value: 'text-[28px]',
    label: '28px (默认)',
  },
  {
    value: 'text-[26px]',
    label: '26px',
  },
  {
    value: 'text-[24px]',
    label: '24px',
  },
  {
    value: 'text-[22px]',
    label: '22px',
  },
  {
    value: 'text-[20px]',
    label: '20px',
  },
  {
    value: 'text-[18px]',
    label: '18px',
  },
  {
    value: 'text-[16px]',
    label: '16px',
  },
  {
    value: 'text-[14px]',
    label: '14px',
  },
]

export function getRandomElementFromList (list) {
  return list[Math.floor(Math.random() * list.length)]
}

export function stringToList (data) {
  if (typeof data === 'string') {
    return [data]
  } else if (Array.isArray(data)) {
    return data
  } else if (data === null) {
    return []
  }
  throw new Error('Data is not a string or an array')
}

export const formatWithLeadingZero = (maxLength, number) => {
  return number.toString().padStart(2, '0')
}

export function extractDateComponents (date) {
  const year = date.getFullYear()
  const month = formatWithLeadingZero(2, date.getMonth() + 1)
  const day = formatWithLeadingZero(2, date.getDate())
  return `${year}.${month}.${day}`
}

export function updateClass (classArray, strOrList, action) {
  classArray = stringToList(classArray)
  strOrList = stringToList(strOrList)
  let newClassArray = []
  if (action === 'add') {
    newClassArray = [...classArray, ...stringToList(strOrList)]
  } else {
    for (let item of classArray) {
      if (!strOrList.includes(item)) {
        newClassArray.push(item)
      }
    }
  }
  return newClassArray
}

const defaultFontSize = 'text-[28px]'

class Day {
  constructor (day) {
    this.day = day
    this.date = day.format('MM.DD')
    this.dayOfWeek = dayClassToChinese[daysOfWeek[day.day()]]
    this.isGroupBroadcasting = false
    this.isRestDay = false
    this[SessionType.EARLY] = new Live(day.clone().hour(18).minute(30))
    this[SessionType.LATE] = new Live(day.clone().hour(21).minute(0))
  }
}


export class ScheduleDataList {
  constructor () {
    this.init()
  }

  init () {
    this.dateRange = new dayjs()
    let start = new dayjs()
    const days = []
    for (let i = 0; i < 7; i++) {
      days.push(new Day(start))
      start = start.add(1, 'day')
    }
    this.data = days
  }

  updateClassName (currentDay, type, className) {
    if (type === SessionType.EARLY) {
      currentDay[SessionType.EARLY]
    }
  }

  updateDateRange (newDateRange) {
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
  const queue = new CircularQueue(vtuberList)
  return (vtuber) => queue.getNext(vtuber)
})()
