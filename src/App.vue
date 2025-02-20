<script setup>
import {ref, computed, onMounted} from 'vue'

const SpecialNames = ['沐霂'];
const NamesList = ['lian', 'queenie', 'bekki', 'yoyi', 'nobody'];
const NamesTable = {
  '梨安': 'lian',
  '沐霂': 'queenie',
  '恬豆': 'bekki',
  '又一': 'yoyi',
  '': 'nobody'
}
const NamesTableReverse = {
  'lian': '梨安',
  'queenie': '沐霂',
  'bekki': '恬豆',
  'yoyi': '又一',
  'nobody': ''
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

// 日期范围2025.2.17 - 2025.2.23
const dateRange = computed(() => {
  const startYear = startOfWeek.value.getFullYear();
  const startMonth = startOfWeek.value.getMonth() + 1;
  const startDate = startOfWeek.value.getDate();

  const endYear = endOfWeek.value.getFullYear();
  const endMonth = endOfWeek.value.getMonth() + 1;
  const endDate = endOfWeek.value.getDate();
  return `${startYear}.${startMonth}.${startDate} - ${endYear}.${endMonth}.${endDate}`;
});

// 生成随机数据的函数
const generateRandomData = (type) => {
  return daysOfWeek.map(() => {
    let name;
    do {
      // 防止结果为空
      const keys = Object.keys(NamesTable);
      const randomIndex = Math.floor(Math.random() * keys.length);
      name = keys[randomIndex];
    } while (name === '')

    let data = getDefaultData(type, undefined);
    data['name'] = name;
    data['class'] = getClassByVtuberName(name)
    return data;
  });
};

// 处理特殊名字：沐霂
function getClassByVtuberName(VtuberName) {

  if (SpecialNames.includes(VtuberName)) {
    return [NamesTable[VtuberName], "special-name"];
  }

  return NamesTable[VtuberName];
}

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
  console.log('changeVtuber', index, type);

  const data = (type === 1) ? randomData1 : randomData2;
  const name = data.value[index].name;
  const nextName = getNextName(NamesTable[name], direction);

  let newData = getDefaultData(type, data.value[index]);
  newData['name'] = NamesTableReverse[nextName];
  newData['class'] = getClassByVtuberName(NamesTableReverse[nextName]);
  data.value[index] = newData;
}

function getDefaultData(type, currentData = undefined) {
  if (currentData !== undefined) {
    return currentData
  }
  return {
    startingTime: type === 1 ? '18:30' : '21:00',
    name: null,
    class: null,
    // mergedType: 0,
    rest: false
  };
}

// 鼠标滚轮事件
function changeVtuberByWheelEvent(index, type, event) {
  if (event.deltaY > 0) {
    changeVtuber(index, type, 1);
  } else {
    changeVtuber(index, type, -1);
  }
}

// 初始化时生成数据
onMounted(() => {
  randomData1.value = generateRandomData(1);
  randomData2.value = generateRandomData(2);
  mergedType.value = new Array(7).fill(0)
});

// 响应式状态
const showTimePicker = ref(false)
const selectedTime = ref(null)
const currentIndex = ref(-1)

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
  const initialTime = currentType.value === 1 ? randomData1.value[index]?.startingTime : randomData2.value[index]?.startingTime
  if (initialTime) {
    selectedTime.value = new Date(`1970-01-01 ${initialTime}`)
  }
}

// 确认选择
function handleConfirm() {
  if (currentIndex.value === -1 || !selectedTime.value)
    return
  // 更新时间
  const formattedTime = selectedTime.value.toLocaleTimeString('zh-CN', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
  })
  console.log('selectedTime', formattedTime)

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

    if (typeof dataArray[index].class === 'string') {
      dataArray[index].class = [dataArray[index].class];
    }
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
  // 3.团播
  if (mergedType.value[index] === 3){

  }
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
            <div class="name" @click="changeVtuber(index, 1)" @wheel="changeVtuberByWheelEvent(index, 1, $event);">
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
              <time class="time" v-show="randomData2[index]?.name" @click="() => openTimePicker(index,2)">
                {{ randomData2[index]?.startingTime }}
              </time>
            </div>
            <div class="name" @click="changeVtuber(index, 2)" @wheel="changeVtuberByWheelEvent(index, 2, $event);">
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
