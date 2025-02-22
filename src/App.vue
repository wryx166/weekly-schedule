<script setup>
import {computed, onMounted, ref} from 'vue'
import {
  dayClassToChinese,
  daysOfWeek, extractDateComponents,
  formatWithLeadingZero,
  getNextVtuber,
  updateClass,
  generateRandomData,
  getClassByVtuberName, fontOptions
} from "@/data.js";


/** @type {import('vue').Ref<Date>} */
const startOfWeek = ref(new Date());

/** @type {import('vue').ComputedRef<Date>} */
const endOfWeek = computed(() => {
  const end = new Date(startOfWeek.value);
  end.setDate(startOfWeek.value.getDate() + 6);
  return end;
});

// 日期范围2025.2.17 - 2025.2.23
const dateRange = computed(() => {
  const {year: startYear, month: startMonth, day: startDate} = extractDateComponents(startOfWeek.value);
  const {year: endYear, month: endMonth, day: endDate} = extractDateComponents(endOfWeek.value);
  return `${startYear}.${startMonth}.${startDate} - ${endYear}.${endMonth}.${endDate}`;
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


// 响应式状态
const showTimePicker = ref(false)
const selectedTime = ref(null)
const currentIndex = ref(-1)
const randomData1 = ref([]);
const randomData2 = ref([]);
const drawer = ref(false)
const currentType = ref(1)

// 自定义对话框
const showCustomizeDialog = ref(false)
const customizeInput = ref('')

const currentFontSize = ref('')


// 合并单元格
// 0: 不合并
// 1: 合并(单播)
// 2: 合并(休息)
// 3: 合并(团播)
const mergedType = ref([])

// 更换虚拟主播
function changeVtuber(index, type, direction = 1) {
  debugger;
  const data = (type === 1) ? randomData1 : randomData2;
  // 中文名
  const name = data.value[index].name;
  // 中文名
  const nextVtuber = getNextVtuber(name, direction);
  // 获取虚拟主播对应的class，
  // ！！！注意：这里的方法包含特殊名字处理
  const prevClass = getClassByVtuberName(name);
  const nextClass = getClassByVtuberName(nextVtuber);

  data.value[index].name = nextVtuber;
  data.value[index].class = updateClass(data.value[index].class, prevClass, 'remove');
  data.value[index].class = updateClass(data.value[index].class, nextClass, 'add');
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

function openCustomizeDialog(index, type) {
  // 数据传递
  currentIndex.value = index
  currentType.value = type
  const data = (type === 1) ? randomData1 : randomData2;
  currentFontSize.value = data.value[index].fontSize
  customizeInput.value = data.value[index].customize
  // 打开对话框
  showCustomizeDialog.value = true
}

function customizeDialogHandleCancel() {
  showCustomizeDialog.value = false
  // 清空输入框
  customizeInput.value = ''
}


function customizeDialogHandleConfirm() {
  console.log('customizeDialogHandleConfirm')
  const input = customizeInput.value
  const index = currentIndex.value
  const fontSize = currentFontSize.value
  const data = (currentType.value === 1) ? randomData1 : randomData2;
  const prevFontSize = data.value[index].fontSize

  // 对应输入框的数据
  const action = input === '' ? 'remove' : 'add'
  data.value[index].customize = input
  data.value[index].class = updateClass(data.value[index].class, "customize", action)


  // 对应字体选项的数据
  debugger;
  data.value[index].class = updateClass(data.value[index].class, prevFontSize, 'remove')
  data.value[index].class = updateClass(data.value[index].class, fontSize, 'add')
  data.value[index].fontSize = fontSize
  // 重置
  showCustomizeDialog.value = false
  customizeInput.value = ''
  currentIndex.value = null
  currentFontSize.value = ''
}

function rotateMerge(index) {


  mergedType.value[index] = (mergedType.value[index] + 1) % 4;

  // 合并单元格
  // 0: 不合并
  // 1: 合并(单播)
  // 2: 合并(休息)
  // 3: 合并(团播)
  console.log('mergedType', mergedType);
  // 2.休息
  let action = mergedType.value[index] === 2 ? 'add' : 'remove';
  randomData1.value[index].class = updateClass(randomData1.value[index].class, "rest", action)
  randomData2.value[index].class = updateClass(randomData2.value[index].class, "rest", action)
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
            :class="['with-image', day, randomData1[index]?.class,{ 'group-broadcasting': mergedType[index] === 3 }]"
            :rowspan="mergedType[index] !== 0 ? 2 : 1"
        >
          <div class="item">
            <div class="hourAndMinute">
              <time
                  class="time"
                  v-show="randomData1[index]?.name || mergedType[index] === 3"
                  @click="() => openTimePicker(index,1)"
              >
                {{ randomData1[index]?.startingTime }}
              </time>
            </div>
            <div class="name"
                 @click="changeVtuber(index, 1)"
                 @wheel="changeVtuberByWheel(index, 1, $event);"
                 @contextmenu.prevent="openCustomizeDialog(index, 1)"
            >
              {{ randomData1[index]?.customize === null ? "" : randomData1[index]?.customize }}
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
            <div class="name" @click="changeVtuber(index, 2)"
                 @wheel="changeVtuberByWheel(index, 2, $event); "
                 @contextmenu.prevent="openCustomizeDialog(index, 2)"
            >
              {{ randomData2[index]?.customize === null ? "" : randomData2[index]?.customize }}
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

    <!-- 自定义排班表弹窗 -->
    <el-dialog
        v-model="showCustomizeDialog"
        title="自定义排班表弹窗"
        append-to-body
    >
      <el-alert title="如果需要还原请删除下方输入框的全部内容" type="info" show-icon/>
      <br>
      <el-input v-model="customizeInput" style="width: 240px" placeholder="自定义内容"/>
      <br>
      <br>
      <el-select v-model="currentFontSize" placeholder="字体大小（默认28px）" style="width: 240px">
        <el-option
            v-for="item in fontOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
        />
      </el-select>
      <template #footer>
        <el-button @click="customizeDialogHandleCancel">取消</el-button>
        <el-button type="primary" @click="customizeDialogHandleConfirm">确定</el-button>
      </template>
    </el-dialog>


  </div>
</template>

<style scoped>
@import './assets/main.css';

</style>
