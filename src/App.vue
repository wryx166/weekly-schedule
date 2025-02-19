<script setup>
import {onMounted, ref} from 'vue'

const SpecialNames = ['沐霂'];
const NamesTable = {
  '梨安': 'lian',
  '恬豆': 'bekki',
  '沐霂': 'queenie',
  '又一': 'yoyi'
}
const dayClassToDayOfWeek = {
  'sunday': '周日',
  'monday': '周一',
  'tuesday': '周二',
  'wednesday': '周三',
  'thursday': '周四',
  'friday': '周五',
  'saturday': '周六'
};

const daysOfWeek = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];

const startOfWeek = new Date('2025-02-17');


const endOfWeek = new Date(startOfWeek);
endOfWeek.setDate(startOfWeek.getDate() + 6);
const dateRange = ref(`${startOfWeek.getFullYear()}.${startOfWeek.getMonth() + 1}.${startOfWeek.getDate()} - ${endOfWeek.getFullYear()}.${endOfWeek.getMonth() + 1}.${endOfWeek.getDate()}`);

// 生成随机数据的函数
const generateRandomData = () => {
  return daysOfWeek.map(() => {
    const keys = Object.keys(NamesTable);
    const randomIndex = Math.floor(Math.random() * keys.length);
    const name = keys[randomIndex];
    if (SpecialNames.includes(name)) {
      return {
        name: name,
        class: [NamesTable[name], "special-name"]
      };
    }
    return {
      name: name,
      class: NamesTable[name]
    };
  });
};

// 响应式数据
const randomData1 = ref([]);
const randomData2 = ref([]);
// 初始化时生成数据
onMounted(() => {
  randomData1.value = generateRandomData();
  randomData2.value = generateRandomData();
});

</script>

<template>
  <div id="app">
    <time class="date-range">
      {{ dateRange }}
    </time>
    <table>
      <thead>
      <tr>
        <th v-for="(day, index) in daysOfWeek" :key="index">
          <div class="day-of-week">{{ dayClassToDayOfWeek[day] }}</div>
          <time class="day"></time>
        </th>
      </tr>
      </thead>
      <tbody>
      <tr>
        <td v-for="(day, index) in daysOfWeek" :key="index"
            :class="['with-image', day, randomData1[index]?.class]">
          <div class="item">
            <time class="time">21:00</time>
            <div class="name">{{ randomData1[index]?.name }}</div>
          </div>
        </td>
      </tr>
      <tr>
        <td v-for="(day, index) in daysOfWeek" :key="index"
            :class="['with-image', day, randomData2[index]?.class]">
          <div class="item">
            <time class="time">21:00</time>
            <div class="name">{{ randomData2[index]?.name }}</div>
          </div>
        </td>
      </tr>
      </tbody>
    </table>
  </div>
</template>

<style scoped>
@import './assets/main.css';

</style>
