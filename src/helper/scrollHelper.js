// scrollHelper.js

export function scrollPage({direction = 'down', distance = 100} = {}) {
  let x = 0, y = 0;

  switch (direction) {
    case 'up':
      y = -distance;
      break;
    case 'down':
      y = distance;
      break;
    case 'left':
      x = -distance;
      break;
    case 'right':
      x = distance;
      break;
    default:
      console.warn('Unknown scroll direction:', direction);
  }

  window.scrollBy({top: y, left: x});

  // 返回当前滚动条位置
  return {
    scrollX: window.scrollX,
    scrollY: window.scrollY
  };
}
