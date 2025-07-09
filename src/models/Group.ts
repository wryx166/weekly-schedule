import type dayjs from "dayjs"

export class Group {
  startingTime: string
  icon: string
  content: string
  type: string
  fontSize: number

  constructor(time: dayjs.Dayjs, vtuberName: string) {
    this.startingTime = time.format('HH:mm')
    this.icon = vtuberName
    this.content = '团播'
    this.type = 'custom'
    this.fontSize = 4.75
  }
}
