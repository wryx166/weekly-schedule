export enum DayType {
  NORMAL = 'normal', // 普通日
  REST_DAY = 'restDay', // 休息日
  GROUP = 'group', // 集体直播
  BLANK = 'blank', // 空白
}

export enum LiveType {
  NORMAL = 'normal', // 普通直播
  CUSTOM = 'custom', // 自定义直播
}

export enum LiveButtonType {
  QUEENIE = '沐霂',
  LIAN = '梨安',
  BEKKI = '恬豆',
  YOYI = '又一',
  CUSTOM = '自定义'
}

export enum IconType {
  QUEENIE = '沐',
  LIAN = '梨',
  BEKKI = '恬',
  YOYI = '又',
  NULL = '不显示'
}

export const VtuberTypeToIcon: { [key: string]: string } = {
  [LiveButtonType.QUEENIE]: IconType.QUEENIE,
  [LiveButtonType.LIAN]: IconType.LIAN,
  [LiveButtonType.BEKKI]: IconType.BEKKI,
  [LiveButtonType.YOYI]: IconType.YOYI
}

export const VtuberIconToEN: { [key: string]: string } = {
  [IconType.QUEENIE]: 'queenie',
  [IconType.LIAN]: 'lian',
  [IconType.BEKKI]: 'bekki',
  [IconType.YOYI]: 'yoyi',
  [IconType.NULL]: 'null',
}

