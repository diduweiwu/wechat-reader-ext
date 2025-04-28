export function simulateKey(key) {
  const event = new KeyboardEvent('keydown', {
    key: key,
    code: key,
    keyCode: key.charCodeAt(0), // 注意：keyCode 在新标准里已经废弃了，但有些老代码可能还要
    bubbles: true,  // 冒泡，才能被全局监听到
    cancelable: true  // 允许阻止默认事件
  });

  document.dispatchEvent(event);  // 派发这个键盘事件
}
