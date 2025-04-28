import {createApp} from 'vue'
import App from './App.vue'
import {
  create,
  NAlert,
  NButton,
  NCard,
  NForm,
  NFormItem,
  NGrid,
  NGridItem,
  NInput,
  NInputNumber,
  NPopover,
  NRadio,
  NRadioGroup,
  NSpace
} from 'naive-ui'
// 挂载节点

const naive = create({
  components: [NButton, NSpace, NPopover, NCard, NGrid, NGridItem, NForm, NFormItem, NInput, NRadio, NRadioGroup, NAlert, NInputNumber]
})

const monkey_plugin = document.createElement("div")
monkey_plugin.id = "monkey_plugin"
monkey_plugin.style = "with:100%;z-index:1000"
document.body.appendChild(monkey_plugin)

const app = createApp(App)
app.use(naive)

app.mount("#monkey_plugin")
