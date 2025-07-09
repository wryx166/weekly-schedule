import dayjs from "dayjs";
import { LiveType, Liver, VtuberTypeToIcon } from "@/data.ts";

// 单独的时间段
export class Live {
  startingTime: string
  icon: string
  content: string
  type: LiveType
  fontSize: number


  constructor(time: dayjs.Dayjs) {
    this.startingTime = time.format('HH:mm')
    const vtuberTypeList = Object.values(Liver).filter(vtuber => vtuber !== Liver.CUSTOM)
    this.content = vtuberTypeList[Math.floor(Math.random() * vtuberTypeList.length)]
    this.icon = VtuberTypeToIcon[this.content]

    this.type = LiveType.NORMAL
    this.fontSize = 4.75
  }
}
