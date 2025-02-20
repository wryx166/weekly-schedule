<script setup>
import {ref, computed, onMounted} from 'vue'

const SpecialNames = ['沐霂'];
const NamesList = ['lian', 'queenie', 'bekki', 'yoyi', ''];
const NamesTable = {
  '梨安': 'lian',
  '沐霂': 'queenie',
  '恬豆': 'bekki',
  '又一': 'yoyi'
}
const NamesTableReverse = {
  'lian': '梨安',
  'queenie': '沐霂',
  'bekki': '恬豆',
  'yoyi': '又一'
}

const daysOfWeek = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
const dayClassToDayOfWeek = {
  'sunday': '周日',
  'monday': '周一',
  'tuesday': '周二',
  'wednesday': '周三',
  'thursday': '周四',
  'friday': '周五',
  'saturday': '周六'
};

function getNextName(name, direction = 1) {
  name = name === undefined ? '' : name;
  const index = NamesList.indexOf(name);
  if (index === -1) {
    throw new Error('Name not found in the list');
  }
  if (direction === 1) {
    return NamesList[(index + 1) % NamesList.length];
  } else {
    return NamesList[(index - 1 + NamesList.length) % NamesList.length];
  }
}

/** @type {import('vue').Ref<Date>} */
const startOfWeek = ref(new Date('2025-02-17'));

// const value1 = ref('')
/** @type {import('vue').ComputedRef<Date>} */
const endOfWeek = computed(() => {
  const end = new Date(startOfWeek.value);
  end.setDate(startOfWeek.value.getDate() + 6);
  return end;
});

const formatWithLeadingZero = (number) => {
  return number.toString().padStart(2, '0');
};

const weekList = computed(() => {
  const start = new Date(startOfWeek.value);
  const days = [];
  for (let i = 0; i < 7; i++) {
    // debugger;
    const month = formatWithLeadingZero(start.getMonth() + 1);
    const date = formatWithLeadingZero(start.getDate());
    const dayOfWeek = dayClassToDayOfWeek[daysOfWeek[start.getDay()]];
    days.push({
      date: `${month}.${date}`,
      dayOfWeek: dayOfWeek
    });
    start.setDate(start.getDate() + 1);
  }
  return days;
});


const dateRange = computed(() => {
  const startYear = startOfWeek.value.getFullYear();
  const startMonth = startOfWeek.value.getMonth() + 1;
  const startDate = startOfWeek.value.getDate();
  // debugger
  const endYear = endOfWeek.value.getFullYear();
  const endMonth = endOfWeek.value.getMonth() + 1;
  const endDate = endOfWeek.value.getDate();
  return `${startYear}.${startMonth}.${startDate} - ${endYear}.${endMonth}.${endDate}`;
});

// 生成随机数据的函数
const generateRandomData = () => {
  return daysOfWeek.map(() => {
    const keys = Object.keys(NamesTable);
    const randomIndex = Math.floor(Math.random() * keys.length);
    const name = keys[randomIndex];
    return {
      class: getClassByVtuberName(name),
      name: name,
      visible: true
    };
  });
};

// 特殊名字的处理
function getClassByVtuberName(VtuberName) {
  // debugger;
  if (SpecialNames.includes(VtuberName)) {
    return [NamesTable[VtuberName], "special-name"];
  }
  return NamesTable[VtuberName];
}

const randomData1 = ref([]);
const randomData2 = ref([]);
const drawer = ref(false)


function changeVtuber(index, group, direction = 1) {
  console.log('changeVtuber', index, group);
  // debugger;

  const data = (group === 1) ? randomData1 : randomData2;
  const name = data.value[index].name;
  // debugger
  const nextName = getNextName(NamesTable[name], direction);

  data.value[index] = {
    name: NamesTableReverse[nextName],
    class: getClassByVtuberName(NamesTableReverse[nextName]),
    visible: true
  };
}

// 鼠标滚轮事件
function changeVtuberByWheelEvent(index, group, event) {
  if (event.deltaY > 0) {
    changeVtuber(index, group, 1);
  } else {
    changeVtuber(index, group, -1);
  }
}

// 初始化时生成数据
onMounted(() => {
  randomData1.value = generateRandomData();
  randomData2.value = generateRandomData();
});
</script>

<template>
  <div id="app">
    <time class="date-range" @click="drawer = true">
      {{ dateRange }}
    </time>
    <table class="schedule">
      <thead class="schedule">
      <tr>
        <th v-for="(day, index) in weekList" :key="index" class="schedule">
          <div class="day-of-week">{{ day.dayOfWeek }}</div>
          <time class="day">{{ day.date }}</time>
        </th>
      </tr>
      </thead>
      <tbody class="schedule">
      <tr>
        <td v-for="(day, index) in daysOfWeek"
            :key="index"
            :class="['with-image', day, randomData1[index]?.class]"
            @click="changeVtuber(index, 1)"
            @wheel="changeVtuberByWheelEvent(index, 1, $event);"
            v-show="randomData1[index]?.visible"
        >
          <div class="item">
            <time class="time" v-show="randomData1[index]?.name">18:30</time>
            <div class="name">{{ randomData1[index]?.name }}</div>
          </div>
        </td>
      </tr>
      <tr>
        <td
            v-for="(day, index) in daysOfWeek"
            :key="index"
            :class="['with-image', day, randomData2[index]?.class]"
            @click="changeVtuber(index, 2)"
            @wheel="changeVtuberByWheelEvent(index, 2, $event);"
            v-show="randomData2[index]?.visible"
        >
          <div class="item">
            <time class="time" v-show="randomData2[index]?.name">21:00</time>
            <div class="name">{{ randomData2[index]?.name }}</div>
          </div>
        </td>
      </tr>
      </tbody>
    </table>


    <el-drawer v-model="drawer" title="I'm outer Drawer" size="50%">
      <div>
        <div class="demo-date-picker">
          <div class="block">
            <el-date-picker
                v-model="startOfWeek"
                type="date"
                placeholder="Pick a day"
                :size="'default'"
            />
          </div>
        </div>
      </div>
    </el-drawer>

  </div>
</template>

<style scoped>
@import './assets/main.css';

.demo-date-picker {
  display: flex;
  width: 100%;
  padding: 0;
  flex-wrap: wrap;
}

.demo-date-picker .block {
  padding: 30px 0;
  text-align: center;
  border-right: solid 1px var(--el-border-color);
  flex: 1;
}

.demo-date-picker .block:last-child {
  border-right: none;
}

</style>
