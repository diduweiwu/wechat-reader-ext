// 创建一个 Worker 脚本的字符串
const workerScript = `

let autoReadTask = null; // 必须先声明！

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

  if (signal === "START" && autoReadTask == null) {
    autoReadTask = setInterval(() => {
      self.postMessage("doAutoReadTask");
    }, readIntervalMillis);
  }

  if (signal === "STOP" && autoReadTask) {
    clearInterval(autoReadTask);
    autoReadTask = null;
  }
};

`;

export function composeWorker() {
// 创建 Worker
// 将 Worker 脚本作为 Blob 对象创建 URL
  const blob = new Blob([workerScript], {type: 'application/javascript'});
  const workerURL = URL.createObjectURL(blob);
  return new Worker(workerURL);
}
