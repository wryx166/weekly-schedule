<script setup>
import {computed, onMounted, ref} from 'vue'
import {
  dayClassToChinese,
  daysOfWeek, extractDateComponents,
  formatWithLeadingZero,
  getNameOfVtuber,
  getNextVtuber,
  getRandomElementFromList,
  isSpecialName,
  stringToList,
  vtuberList
} from "@/data.js";


/** @type {import('vue').Ref<Date>} */
const startOfWeek = ref(new Date('2025-02-17'));

// const value1 = ref('')
/** @type {import('vue').ComputedRef<Date>} */
const endOfWeek = computed(() => {
  const end = new Date(startOfWeek.value);
  end.setDate(startOfWeek.value.getDate() + 6);
  return end;
});

const weekList = computed(() => {
  const start = new Date(startOfWeek.value);
  const days = [];
  for (let i = 0; i < 7; i++) {
    const month = formatWithLeadingZero(start.getMonth() + 1);
    const date = formatWithLeadingZero(start.getDate());
    const dayOfWeek = dayClassToChinese[daysOfWeek[start.getDay()]];
    days.push({
      date: `${month}.${date}`,
      dayOfWeek: dayOfWeek
    });
    start.setDate(start.getDate() + 1);
  }
  return days;
});

// 日期范围2025.2.17 - 2025.2.23
const dateRange = computed(() => {
  const {year: startYear, month: startMonth, day: startDate} = extractDateComponents(startOfWeek.value);
  const {year: endYear, month: endMonth, day: endDate} = extractDateComponents(endOfWeek.value);
  return `${startYear}.${startMonth}.${startDate} - ${endYear}.${endMonth}.${endDate}`;
});

// 生成随机数据的函数
function generateRandomData(type) {
  const randomData = [];
  for (let i = 0; i < 7; i++) {
    const data = getDefaultData(type);
    const name = getRandomElementFromList(vtuberList);
    data['name'] = name;
    data['class'] = getClassByVtuberName(name);
    randomData.push(data);
  }
  return randomData
}

// 处理特殊名字：沐霂
function getClassByVtuberName(VtuberName) {
  const name = getNameOfVtuber(VtuberName);
  return isSpecialName(VtuberName) ? [name, "special-name"] : name;
}

// 响应式状态
const showTimePicker = ref(false)
const selectedTime = ref(null)
const currentIndex = ref(-1)
const randomData1 = ref([]);
const randomData2 = ref([]);
const drawer = ref(false)
const currentType = ref(1)

// 合并单元格
// 0: 不合并
// 1: 合并(单播)
// 2: 合并(休息)
// 3: 合并(团播)
const mergedType = ref([])

// 更换虚拟主播
function changeVtuber(index, type, direction = 1) {

  const data = (type === 1) ? randomData1 : randomData2;
  // 中文名
  const name = data.value[index].name;
  const nextVtuber = getNextVtuber(name, direction);

  data.value[index].name = nextVtuber;
  data.value[index].class = getClassByVtuberName(nextVtuber);
}

function getDefaultData(type) {
  return {
    startingTime: type === 1 ? '18:30' : '21:00',
    name: null,
    class: null,
    rest: false
  };
}

// 鼠标滚轮事件
function changeVtuberByWheel(index, type, event) {
  changeVtuber(index, type, event.deltaY > 0 ? 1 : -1);
}

// 初始化时生成数据
onMounted(() => {
  randomData1.value = generateRandomData(1);
  randomData2.value = generateRandomData(2);
  mergedType.value = new Array(7).fill(0)
});


// 时间格式配置
const timeFormat = 'HH:mm'
const timeType = 'time' // 可选 'date', 'time', 'datetime'

// 打开时间选择器
function openTimePicker(index, type) {
  currentIndex.value = index
  // 用于handleConfirm回写
  currentType.value = type
  showTimePicker.value = true

  // 初始化选中时间
  let initialTime
  if (currentType.value === 1) {
    initialTime = randomData1.value[index]?.startingTime
  } else {
    initialTime = randomData2.value[index]?.startingTime
  }
  selectedTime.value = new Date(`1970-01-01 ${initialTime}`)
}

// 时间选择器：确认选择
function handleConfirm() {
  if (currentIndex.value === -1 || !selectedTime.value)
    return
  // 更新时间
  const formattedTime = selectedTime.value.toLocaleTimeString('zh-CN', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
  })

  if (currentType.value === 1)
    randomData1.value[currentIndex.value].startingTime = formattedTime
  else {
    randomData2.value[currentIndex.value].startingTime = formattedTime
  }

  showTimePicker.value = false
}

// 取消选择
function handleCancel() {
  showTimePicker.value = false
  // 可选：重置时间
  selectedTime.value = null
}

function rotateMerge(index) {
  function updateClass(dataArray, index, action) {
    dataArray[index].class = stringToList(dataArray[index].class);

    if (action === 'add') {
      dataArray[index].class.push('rest');
    } else {
      dataArray[index].class = dataArray[index].class.filter(item => item !== 'rest');
    }
  }

  mergedType.value[index] = (mergedType.value[index] + 1) % 4;

  // 合并单元格
  // 0: 不合并
  // 1: 合并(单播)
  // 2: 合并(休息)
  // 3: 合并(团播)
  console.log('mergedType', mergedType);
  // 2.休息
  if (mergedType.value[index] === 2) {
    updateClass(randomData1.value, index, 'add');
    updateClass(randomData2.value, index, 'add');
    randomData1.value[index].rest = true;
    randomData2.value[index].rest = true;
  } else {
    updateClass(randomData1.value, index, 'remove');
    updateClass(randomData2.value, index, 'remove');
    randomData1.value[index].rest = false;
    randomData2.value[index].rest = false;
  }
  // // 3.团播
  // if (mergedType.value[index] === 3) {
  //
  // }
}

</script>

<template>
  <div id="app">
    <time class="date-range" @click="drawer = true">
      {{ dateRange }}
    </time>
    <table class="schedule">
      <thead class="schedule">
      <tr>
        <th v-for="(day, index) in weekList" :key="index" class="schedule" @click="rotateMerge(index)">
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
            :rowspan="mergedType[index] !== 0 ? 2 : 1"
        >
          <div class="item">
            <div class="hourAndMinute">
              <time
                  class="time"
                  v-show="randomData1[index]?.name"
                  @click="() => openTimePicker(index,1)"
              >
                {{ randomData1[index]?.startingTime }}
              </time>
            </div>
            <div class="name" @click="changeVtuber(index, 1)" @wheel="changeVtuberByWheel(index, 1, $event);">
              {{ mergedType[index] !== 3 ? randomData1[index]?.name : '团播' }}
            </div>
          </div>
          <div class="rest"/>
        </td>
      </tr>
      <tr>
        <td
            v-for="(day, index) in daysOfWeek"
            :key="index"
            :class="['with-image', day, randomData2[index]?.class]"
            v-show="mergedType[index]===0"
        >
          <div class="item">
            <div class="hourAndMinute">
              <time class="time" v-show="randomData2[index]?.name" @click="openTimePicker(index,2)">
                {{ randomData2[index]?.startingTime }}
              </time>
            </div>
            <div class="name" @click="changeVtuber(index, 2)" @wheel="changeVtuberByWheel(index, 2, $event);">
              {{ randomData2[index]?.name }}
            </div>
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


    <!-- 时间选择器弹窗 -->
    <el-dialog
        v-model="showTimePicker"
        title="选择时间"
        append-to-body
    >
      <el-time-picker
          v-model="selectedTime"
          :format="timeFormat"
          :value-type="timeType"
          placeholder="选择时间"
      />

      <template #footer>
        <el-button @click="handleCancel">取消</el-button>
        <el-button type="primary" @click="handleConfirm">确定</el-button>
      </template>
    </el-dialog>

  </div>
</template>

<style scoped>
@import './assets/main.css';

</style>
