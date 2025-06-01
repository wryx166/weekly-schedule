import dayjs from "dayjs";
import {VtuberType, VtuberTypeToIcon} from "@/data.ts";

// 单独的时间段
export class Live {
  startingTime: dayjs.Dayjs
  icon: string
  content: string
  type: string
  fontSize: number


  constructor(time: dayjs.Dayjs) {
    this.startingTime = time
    const vtuberTypeList = Object.values(VtuberType).filter(vtuber => vtuber !== VtuberType.CUSTOM)
    this.content = vtuberTypeList[Math.floor(Math.random() * vtuberTypeList.length)]
    this.icon = VtuberTypeToIcon[this.content]

    this.type = 'normal' // normal, custom
    this.fontSize = 4.75
  }
}
