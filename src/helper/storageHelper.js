// localStorageHelper.js

// 序列化并保存对象到 localStorage
export function setItem(key, value) {
  try {
    const serializedValue = JSON.stringify(value);
    localStorage.setItem(key, serializedValue);
  } catch (e) {
    console.error(`Failed to serialize and save ${key}:`, e);
  }
}


// 保存数据 localStorage
export function setSingItem(key, value) {
  try {
    localStorage.setItem(key, value);
  } catch (e) {
    console.error(`Failed to serialize and save ${key}:`, e);
  }
}

// 获取数据 localStorage
export function getSingleItem(key) {
  try {
    return localStorage.getItem(key);
  } catch (e) {
    console.error(`Failed to serialize and save ${key}:`, e);
  }
}

// 从 localStorage 获取对象，并处理反序列化
export function getItem(key, defaultValue = null) {
  try {
    const serializedValue = localStorage.getItem(key);
    if (serializedValue) {
      return JSON.parse(serializedValue);
    } else {
      console.warn(`${key} not found, returning default value.`);
      return defaultValue;  // 若没有找到对应数据，则返回默认值
    }
  } catch (e) {
    console.error(`Failed to deserialize ${key}:`, e);
    return defaultValue;  // 若反序列化失败，则返回默认值
  }
}

// 删除指定的键值对
export function removeItem(key) {
  try {
    localStorage.removeItem(key);
  } catch (e) {
    console.error(`Failed to remove ${key}:`, e);
  }
}

// 清空所有 localStorage 数据
export function clear() {
  try {
    localStorage.clear();
  } catch (e) {
    console.error("Failed to clear localStorage:", e);
  }
}
