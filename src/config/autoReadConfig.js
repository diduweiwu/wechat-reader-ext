import {getItem, setItem} from "../helper/storageHelper";

export const storageKey = {
  READ_CONFIG: "READ_CONFIG",
}

export const defaultReadConfig = {
  isAutoReading: false,

  readStep: 100,
  readIntervalMillis: 100,
  readDirection: "down",
  switchPageDirection: "right",
  autoSwitch: false,
  autoRefresh: false,

  readWith: 1024,
  autoWith: false,
  showToolbar: false,
  randomSleep: false,
  sleepTimeSeconds: 60,

  // 无限卡天数
  infiniteCardDays: 0,
  // ios端书币
  iosBookCoin: 0,
  // 安卓端书币
  androidBookCoin: 0,
  // 当前阅读时长
  currentReadingTime: 0,
  // 总共阅读时长
  totalReadingTime: 0,
}

// 更新部分配置
export function updatePartialReadConfig(partialConfig) {
  const readConfig = getItem(storageKey.READ_CONFIG, defaultReadConfig)
  Object.assign(readConfig, partialConfig)
  setItem(storageKey.READ_CONFIG, readConfig)
}
