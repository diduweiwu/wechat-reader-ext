import taskSignal from "./taskSignal";
import {defaultReadConfig} from "@/config/autoReadConfig";
import {scrollPage} from "@/helper/scrollHelper";

export function composeAutoReadWorker() {
  return new Worker(new URL('../worker/autoReadWorker.js', import.meta.url), {type: 'module'});
}

export function startRead(worker, readConfig = defaultReadConfig) {
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
  let distance = readConfig.readStep
  worker.onmessage = (event) => {
    const maxScrollY = document.documentElement.scrollHeight - window.innerHeight;
    const {scrollY} = scrollPage({direction, distance})
    if (scrollY >= maxScrollY) {
      direction = "up";
      return
    }
    if (scrollY === 0) {
      direction = "down";
    }
  };
}


export function stopRead(worker) {
  if (!worker) {
    console.log("worker not found");
    return;
  }
  worker.postMessage({
    signal: taskSignal.STOP
  })
}



