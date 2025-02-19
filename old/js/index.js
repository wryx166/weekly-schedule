const dayClassToDayOfWeek = {
    'sunday': '周日',
    'monday': '周一',
    'tuesday': '周二',
    'wednesday': '周三',
    'thursday': '周四',
    'friday': '周五',
    'saturday': '周六'
};

const dayOfWeekToDayClass = {
    '周日': 'sunday',
    '周一': 'monday',
    '周二': 'tuesday',
    '周三': 'wednesday',
    '周四': 'thursday',
    '周五': 'friday',
    '周六': 'saturday'
}

const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

const NamesTable = {
    '梨安': 'lian',
    '恬豆': 'bekki',
    '沐霂': 'queenie',
    '又一': 'yoyi'
}

document.querySelectorAll('.name').forEach(function (element) {
    const name = element.textContent;
    const className = NamesTable[name];
    if (className) {
        element.closest('td').classList.add(className);
    } else {
        console.error('No match', name);
    }
    if (name === '沐霂') {
        element.classList.add('special-name');
    }
});


const dateRangeElement = document.querySelector('.date-range');
const dateRangeText = dateRangeElement.textContent.trim();
const [startDate, endDate] = dateRangeText.split('-').map(date => new Date(date));
// const dates = [];
let weekTable = {}
// 分割出七天
for (let date = new Date(startDate); date <= endDate; date.setDate(date.getDate() + 1)) {
    // const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');

    weekTable[daysOfWeek[date.getDay()].toLowerCase()] = `${month}.${day}`;
}


// 给日期赋值
// debugger;
document.querySelectorAll('th > .day').forEach(function (element) {
    // debugger;
    const dayOfWeek = element.parentElement.querySelector('.day-of-week');
    const dayOfWeekText = dayOfWeek.textContent.trim();
    const dayClass = dayOfWeekToDayClass[dayOfWeekText];
    // debugger;
    if (dayClass) {
        element.textContent = weekTable[dayClass.toLowerCase()];
    } else {
        throw Error('No day class found for');
    }
});