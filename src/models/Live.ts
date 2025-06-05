import dayjs from "dayjs";
import {LiveType, LiveButtonType, VtuberTypeToIcon} from "@/data.ts";

// 单独的时间段
export class Live {
  startingTime: dayjs.Dayjs
  icon: string
  content: string
  type: LiveType
  fontSize: number


  constructor(time: dayjs.Dayjs) {
    this.startingTime = time
    const vtuberTypeList = Object.values(LiveButtonType).filter(vtuber => vtuber !== LiveButtonType.CUSTOM)
    this.content = vtuberTypeList[Math.floor(Math.random() * vtuberTypeList.length)]
    this.icon = VtuberTypeToIcon[this.content]

    this.type = LiveType.NORMAL
    this.fontSize = 4.75
  }

  toJSON() {
    // noinspection SpellCheckingInspection
    return {
      startingTime: this.startingTime.format('YYYY-MM-DD HH:mm:ss'),
      icon: this.icon,
      content: this.content,
      type: this.type,
      fontSize: this.fontSize,
    }
  }

  static fromJSON(obj: any) {
    const live = new Live(dayjs(obj.startingTime))
    live.icon = obj.icon
    live.content = obj.content
    live.type = obj.type
    live.fontSize = obj.fontSize
    return live
  }
}
