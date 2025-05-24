import { computed, ref } from 'vue'

export const SessionType = {
  EARLY: 'early',  // 早场
  LATE: 'late'     // 晚场
}

const vtuberListEn = ['lian', 'queenie', 'bekki', 'yoyi', 'nobody']

const vtuberList = ['梨安', '沐霂', '恬豆', '又一']

const daysOfWeek = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday']

// 单独的时间段
class Live {
  constructor (time) {

    this.startingTime = time === SessionType.EARLY ? '18:30' : '21:00'
    this.rest = false
    this.customize = null
    this.fontSize = defaultFontSize

    const characters = ['梨安', '沐霂', '恬豆', '又一']
    const classes = {
      '沐霂': ['queenie', 'special-name'],
      '梨安': 'lian',
      '恬豆': 'bekki',
      '又一': 'yoyi'
    }
    this.name = characters[Math.floor(Math.random() * characters.length)]
    this.class = classes[this.name]
  }

  handleVtuberClick () {
    console.log('Clicked session:', this)
    const nextVTuber = getNextVTuber(this.name)
    console.log('下一个 VTuber 是:', nextVTuber)
    if (nextVTuber) {
      this.name = nextVTuber
      this.class = this.getClassByVtuber(nextVTuber)
    }
    return nextVTuber
  }

  getClassByVtuber (name) {
    const classes = {
      '沐霂': ['queenie', 'special-name'], '梨安': 'lian', '恬豆': 'bekki', '又一': 'yoyi'
    }
    return classes[name] || null
  }
}

export const dayClassToChinese = {
  'sunday': '周日',
  'monday': '周一',
  'tuesday': '周二',
  'wednesday': '周三',
  'thursday': '周四',
  'friday': '周五',
  'saturday': '周六'
}

/** @type {import('vue').Ref<Date>} */
export const startOfWeek = ref(new Date())

/** @type {import('vue').ComputedRef<Date>} */
const endOfWeek = computed(() => {
  const end = new Date(startOfWeek.value)
  end.setDate(startOfWeek.value.getDate() + 6)
  return end
})

// 日期范围2025.2.17 - 2025.2.23
export const dateRange = computed(() => {
  return `${extractDateComponents(startOfWeek.value)} - ${extractDateComponents(endOfWeek.value)}`
})

export const fontOptions = [{
  value: 'text-[28px]', label: '28px (默认)',
}, {
  value: 'text-[26px]', label: '26px',
}, {
  value: 'text-[24px]', label: '24px',
}, {
  value: 'text-[22px]', label: '22px',
}, {
  value: 'text-[20px]', label: '20px',
}, {
  value: 'text-[18px]', label: '18px',
}, {
  value: 'text-[16px]', label: '16px',
}, {
  value: 'text-[14px]', label: '14px',
},]

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

export class ScheduleDataList {
  constructor () {
    this.init()
  }

  init () {
    const start = new Date(startOfWeek.value)
    const days = []
    for (let i = 0; i < 7; i++) {
      const month = formatWithLeadingZero(2, start.getMonth() + 1)
      const date = formatWithLeadingZero(2, start.getDate())
      const dayOfWeek = dayClassToChinese[daysOfWeek[start.getDay()]]
      days.push({
        date: `${month}.${date}`,
        dayOfWeek: dayOfWeek,
        [SessionType.EARLY]: new Live('18:30'),
        [SessionType.LATE]: new Live('21:00')
      })
      start.setDate(start.getDate() + 1)
    }
    this.data = days

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

  getAll () {
    return this.items
  }
}

const getNextVTuber = (() => {
  const queue = new CircularQueue(vtuberList)
  return (vtuber) => queue.getNext(vtuber)
})()