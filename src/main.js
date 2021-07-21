import Vue from 'vue'
import App from './App.vue'

import {
  Input,
  Radio,
  RadioGroup,
  Button,
  Popover,
  Tooltip,
  Form,
  FormItem,
  Card,
  Tabs,
  TabPane,
  Row,
  Col,
} from 'element-ui';

Vue.use(Input)
Vue.use(Radio)
Vue.use(RadioGroup)
Vue.use(Button)
Vue.use(Popover)
Vue.use(Tooltip)
Vue.use(Form)
Vue.use(FormItem)
Vue.use(Card)
Vue.use(Tabs)
Vue.use(TabPane)
Vue.use(Row)
Vue.use(Col)

// 挂载节点
const monkey_plugin = document.createElement("div")
monkey_plugin.id = "monkey_plugin"
monkey_plugin.style = "position:fixed;top:10px;left:10px;width:1px;height:1px;z-index:1000"
document.body.appendChild(monkey_plugin)

new Vue({
  el: '#monkey_plugin',
  render: h => h(App)
})
