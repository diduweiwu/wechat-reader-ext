import {createApp} from 'vue'
import App from './App.vue'

// 挂载节点
const monkey_plugin = document.createElement("div")
monkey_plugin.id = "monkey_plugin"
monkey_plugin.style = "position:fixed;top:10px;left:10px;width:200px;height:200px;z-index:1000"
document.body.appendChild(monkey_plugin)

createApp(App).mount("#monkey_plugin")
