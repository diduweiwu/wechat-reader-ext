export default {
  methods: {
    fireKeyEvent(el, evtType, keyCode) {
      let evtObj;
      if (document.createEvent) {
        // firefox 浏览器下模拟事件
        if (window.KeyEvent) {
          evtObj = document.createEvent("KeyEvents");
          evtObj.initKeyEvent(evtType, true, true);
          el.dispatchEvent(evtObj);
          return;
        }

        // chrome 浏览器下模拟事件
        evtObj = document.createEvent("UIEvents");
        evtObj.initUIEvent(evtType, true, true);

        delete evtObj.keyCode;
        //为了模拟keycode
        if (typeof evtObj.keyCode === "undefined") {
          Object.defineProperty(evtObj, "keyCode", { value: keyCode });
        } else {
          evtObj.key = String.fromCharCode(keyCode);
        }

        if (typeof evtObj.ctrlKey === "undefined") {
          //为了模拟ctrl键
          Object.defineProperty(evtObj, "ctrlKey", { value: true });
        } else {
          evtObj.ctrlKey = true;
        }

        el.dispatchEvent(evtObj);
        return;
      }

      //IE 浏览器下模拟事件
      if (document.createEventObject) {
        evtObj = document.createEventObject();
        evtObj.keyCode = keyCode;
        el.fireEvent("on" + evtType, evtObj);
      }
    },
  },
}
