import { computed, ref } from 'vue'

export const SessionType = {
  EARLY: 'early',  // 早场
  LATE: 'late'     // 晚场
}

// src/data.js
export const nameTableReverse = {
  'lian': '梨安',
  'queenie': '沐霂',
  'bekki': '恬豆',
  'yoyi': '又一',
  'nobody': ''
}

export const nameTable = {
  '梨安': 'lian',
  '沐霂': 'queenie',
  '恬豆': 'bekki',
  '又一': 'yoyi',
  '': 'nobody'
}

export const specialNameList = ['沐霂']

export function getNameOfVtuber (vtuber) {
  return nameTable[vtuber]
}

export function isSpecialName (name) {
  return specialNameList.includes(name)
}

export const nameList = ['lian', 'queenie', 'bekki', 'yoyi', 'nobody']

export const vtuberList = ['梨安', '沐霂', '恬豆', '又一']

export const daysOfWeek = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday']

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

// 生成随机数据的函数
export function generateRandomData () {
  const randomData = [];
  for (let i = 0; i < 7; i++) {
    let tmp = [];
      [SessionType.EARLY, SessionType.LATE].forEach((session) => {
      const data = getDefaultData(session)
      const name = getRandomElementFromList(vtuberList)
      data['class'] = getClassByVtuberName(name)
      data['name'] = name
      tmp.push(data)
    })
    randomData.push(tmp)
  }
  return randomData
}

// 处理特殊名字：沐霂
export function getClassByVtuberName (VtuberName) {
  const name = getNameOfVtuber(VtuberName)
  return isSpecialName(VtuberName) ? [name, 'special-name'] : name
}

const defaultFontSize = 'text-[28px]'

// 默认数据
export function getDefaultData (time) {
  return {
    startingTime: time === SessionType.EARLY ? '18:30' : '21:00',
    name: null,
    class: null,
    rest: false,
    customize: null,
    fontSize: defaultFontSize,
  }
}