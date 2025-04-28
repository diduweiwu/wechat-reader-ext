import mitt from 'mitt';

const emitter = mitt();
const eventKey = {
  READ_CONFIG_UPDATE_EVENT: "READ_CONFIG_UPDATE_EVENT"
}

// 监听事件
export function onEvent(eventKey, callback) {
  emitter.on(eventKey, callback);
}

// 取消事件监听
export function offEvent(eventKey, callback) {
  emitter.off(eventKey, callback);
}

// 触发事件
export function fireEvent(eventKey, data) {
  emitter.emit(eventKey, data);
}

export {
  emitter,
  eventKey,
}
