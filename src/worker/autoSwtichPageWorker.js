import taskSignal from "@/task/taskSignal";

let autoSwitchPageTask = null; // 必须先声明！

self.onmessage = (e) => {
  const payload = e.data;
  if (!payload) {
    console.log("payload is empty");
    return;
  }

  const {signal, readIntervalMillis} = payload;
  if (!signal) {
    console.log('No signal in auto read worker');
    return;
  }

  if (signal === taskSignal.START && autoSwitchPageTask == null) {
    autoSwitchPageTask = setInterval(() => {
      self.postMessage("doAutoSwitchPageTask");
    }, readIntervalMillis);
  }

  if (signal === taskSignal.STOP && autoSwitchPageTask) {
    clearInterval(autoSwitchPageTask);
    autoSwitchPageTask = null;
  }
};
