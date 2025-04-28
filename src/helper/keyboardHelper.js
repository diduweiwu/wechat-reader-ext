export const KEY_ARROW_LEFT = 'ArrowLeft';
export const KEY_ARROW_UP = 'ArrowUp';
export const KEY_ARROW_RIGHT = 'ArrowRight';
export const KEY_ARROW_DOWN = 'ArrowDown';
export const KEY_ENTER = 'Enter';
export const KEY_ESCAPE = 'Escape';
export const KEY_SPACE = 'Space';

export function fireKeyEvent(target, type, keyInput) {
  let key, code, keyCode;

  if (typeof keyInput === 'string') {
    key = keyInput;
    code = keyInput;
    // 字符串的话，我们自动根据常见key来补充keyCode
    const keyCodeMap = {
      ArrowLeft: 37,
      ArrowUp: 38,
      ArrowRight: 39,
      ArrowDown: 40,
      Enter: 13,
      Escape: 27,
      Space: 32,
    };
    keyCode = keyCodeMap[key] ?? keyInput.charCodeAt(0); // 如果是普通字符
  } else if (typeof keyInput === 'number') {
    keyCode = keyInput;
    const reverseMap = {
      37: 'ArrowLeft',
      38: 'ArrowUp',
      39: 'ArrowRight',
      40: 'ArrowDown',
      13: 'Enter',
      27: 'Escape',
      32: ' ',
    };
    key = reverseMap[keyCode] ?? String.fromCharCode(keyCode);
    code = key;
  } else {
    throw new Error('fireKeyEvent: keyInput must be string or number!');
  }

  let event;
  try {
    event = new KeyboardEvent(type, {
      key: key,
      code: code,
      keyCode: keyCode,
      which: keyCode,
      bubbles: true,
      cancelable: true,
    });

    // 强制覆盖 keyCode / which
    Object.defineProperty(event, 'keyCode', {value: keyCode});
    Object.defineProperty(event, 'which', {value: keyCode});

  } catch (e) {
    event = document.createEvent('Event');
    event.initEvent(type, true, true);
    event.keyCode = keyCode;
    event.which = keyCode;
  }

  target.dispatchEvent(event);
}

export function simulateArrowLeft() {
  fireKeyEvent(document, 'keydown', KEY_ARROW_LEFT);  // 左箭头翻页
}

export function simulateArrowRight() {
  fireKeyEvent(document, 'keydown', KEY_ARROW_RIGHT);  // 左箭头翻页
}

