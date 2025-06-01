import dayjs from "dayjs";

export class Group {
  startingTime: dayjs.Dayjs
  icon: string
  content: string
  fontSize: number

  constructor(time: dayjs.Dayjs, vtuberName: string) {
    this.startingTime = time
    this.icon = vtuberName
    this.content = '团播'
    this.fontSize = 4.75
  }
}
