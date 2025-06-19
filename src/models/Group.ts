import dayjs from "dayjs";

export class Group {
  startingTime: dayjs.Dayjs
  icon: string
  content: string
  type: string
  fontSize: number

  constructor(time: dayjs.Dayjs, vtuberName: string) {
    this.startingTime = time
    this.icon = vtuberName
    this.content = '团播'
    this.type = 'custom'
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
    const group = new Group(dayjs(obj.startingTime), obj.icon)
    group.content = obj.content
    group.type = obj.type
    group.fontSize = obj.fontSize
    return group
  }
}
