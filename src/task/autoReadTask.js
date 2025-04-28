import taskSignal from "./taskSignal";
import {defaultReadConfig} from "@/config/autoReadConfig";
import {scrollPage} from "@/helper/scrollHelper";
import {composeWorker} from "@/worker/autoReadWorker.worker";

export function composeAutoReadWorker() {
  return composeWorker()
}

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
  worker.onmessage = (event) => {
    const maxScrollY = document.documentElement.scrollHeight - window.innerHeight;
    const {scrollY} = scrollPage({direction, distance})
    // // 开启了自动翻页
    // if (!!autoSwitchPage) {
    //   if (autoSwitchPageDirection === swtichPageDirection.LEFT) {
    //     simulateArrowLeft()
    //     return;
    //   }
    //
    //   // 开启了自动翻页，优先进行自动翻页
    //   if (autoSwitchPageDirection === swtichPageDirection.RIGHT) {
    //     simulateArrowRight()
    //     return;
    //   }
    //
    //   return;
    // }

    if (scrollY >= maxScrollY) {
      direction = "up";
      return
    }
    if (scrollY === 0) {
      direction = "down";
    }
  };
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

