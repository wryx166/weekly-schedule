// src/data.js
export const nameTableReverse = {
    'lian': '梨安',
    'queenie': '沐霂',
    'bekki': '恬豆',
    'yoyi': '又一',
    'nobody': ''
};

export const nameTable = {
    '梨安': 'lian',
    '沐霂': 'queenie',
    '恬豆': 'bekki',
    '又一': 'yoyi',
    '': 'nobody'
}

export const specialNameList = ['沐霂'];

export function getNameOfVtuber(vtuber) {
    return nameTable[vtuber];
}

export function isSpecialName(name) {
    return specialNameList.includes(name);
}

export const nameList = ['lian', 'queenie', 'bekki', 'yoyi', 'nobody'];

export const vtuberList = ['梨安', '沐霂', '恬豆', '又一'];

export const daysOfWeek = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];

export const dayClassToChinese = {
    'sunday': '周日',
    'monday': '周一',
    'tuesday': '周二',
    'wednesday': '周三',
    'thursday': '周四',
    'friday': '周五',
    'saturday': '周六'
};

export function getNextVtuber(name, direction = 1) {
    name = nameTable[name];
    name = name === undefined ? '' : name;
    const index = nameList.indexOf(name);
    if (index === -1) {
        throw new Error('Name not found in the list');
    }
    let next;
    if (direction === 1) {
        next = nameList[(index + 1) % nameList.length];
    } else {
        next = nameList[(index - 1 + nameList.length) % nameList.length];
    }
    return nameTableReverse[next];
}

export function getRandomElementFromList(list) {
    return list[Math.floor(Math.random() * list.length)];
}

export function stringToList(data) {
    if (typeof data === "string") {
        return [data];
    } else if (Array.isArray(data)) {
        return data;
    }
    throw new Error('Data is not a string or an array');
}

export const formatWithLeadingZero = (number) => {
    return number.toString().padStart(2, '0');
};

export function extractDateComponents(date) {
  return {
    year: date.getFullYear(),
    month: date.getMonth() + 1,
    day: date.getDate()
  };
}