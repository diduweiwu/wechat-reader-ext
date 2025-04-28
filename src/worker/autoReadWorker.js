import taskSignal from "../const/taskSignal";

let autoReadTask = null; // 必须先声明！

self.onmessage = (e) => {
  const payload = e.data;
  if (!payload) {
    console.log("payload is empty");
    return;
  }

  const {signal,readIntervalMillis} = payload;
  if (!signal) {
    console.log('No signal in auto read worker');
    return;
  }

  if (signal === taskSignal.START && autoReadTask == null) {
    autoReadTask = setInterval(() => {
      self.postMessage("doAutoReadTask");
    }, readIntervalMillis);
  }

  if (signal === taskSignal.STOP && autoReadTask) {
    clearInterval(autoReadTask);
    autoReadTask = null;
  }
};
