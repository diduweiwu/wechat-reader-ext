import taskSignal from "./taskSignal";
import {defaultReadConfig} from "@/config/autoReadConfig";
import {scrollPage} from "@/helper/scrollHelper";
import workerRaw from '@/worker/autoReadWorker.worker?raw';
import {simulateArrowLeft, simulateArrowRight} from "@/helper/keyboardHelper";
import swtichPageDirection from "@/task/swtichPageDirection";

export function composeAutoReadWorker() {

  const blob = new Blob([workerRaw], {type: 'application/javascript'});
  const workerUrl = URL.createObjectURL(blob);
  return new Worker(workerUrl);
}


// 自动刷新的定时器
let autoRefreshStartTime = Date.now();

//自动滚动任务
export function startAutoReadTask(worker, readConfig = defaultReadConfig) {
  if (!worker) {
    console.log("worker not found");
    return;
  }

  let readIntervalMillis = readConfig.readIntervalMillis
  worker.postMessage({
    signal: taskSignal.START,
    readIntervalMillis: readIntervalMillis
  });

  // 打开worker事件监听
  let direction = readConfig.readDirection
  const distance = readConfig.readStep
  // 是否自动翻页
  const autoSwitchPage = readConfig.autoSwitchPage
  const autoSwitchPageDirection = readConfig.autoSwitchPageDirection

  const autoRefresh = readConfig.autoRefresh
  const autoRefreshSeconds = readConfig.autoRefreshSeconds

  let isReloading = false
  worker.onmessage = (event) => {
    if (isReloading){
      console.log("Reloading...");
      autoRefreshStartTime = Date.now();
      return;
    }

    const maxScrollY = document.documentElement.scrollHeight - window.innerHeight;
    const {scrollY} = scrollPage({direction, distance})

    // 检测是否要刷新页面
    const currentTime = Date.now()
    const refreshTimeCount = currentTime - autoRefreshStartTime
    if (autoRefresh && refreshTimeCount >= autoRefreshSeconds * 1000) {
      isReloading = true
      location.reload()
      return;
    }

    if (scrollY >= maxScrollY) {
      // 执行了翻页
      if (ifSwitchPage(autoSwitchPage, autoSwitchPageDirection)) {
        return;
      }

      direction = "up";
      return
    }

    if (scrollY === 0) {
      if (ifSwitchPage(autoSwitchPage, autoSwitchPageDirection)) {
        return;
      }

      direction = "down";
    }
  };
}

function ifSwitchPage(autoSwitchPage, autoSwitchPageDirection) {
  // 开启了自动翻页
  if (!!autoSwitchPage) {
    if (autoSwitchPageDirection === swtichPageDirection.LEFT) {
      simulateArrowLeft()
      return true;
    }

    // 开启了自动翻页，优先进行自动翻页
    if (autoSwitchPageDirection === swtichPageDirection.RIGHT) {
      simulateArrowRight()
      return true;
    }

    return false;
  }

  return false;
}

export function stopAutoReadTask(worker) {
  if (!worker) {
    console.log("worker not found");
    return;
  }
  worker.postMessage({
    signal: taskSignal.STOP
  })
}

