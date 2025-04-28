<script setup>

import ReadConfig from "./ReadConfigCard.vue";
import OtherConfig from "./OtherConfigCard.vue";
import MyAccountant from "./AccountCard.vue";
import {getItem} from "../../helper/storageHelper";
import {defaultReadConfig, storageKey} from "../../const/readConfigstorage";

// 从localStorage读取初始化配置
const storageReadConfig = getItem(storageKey.READ_CONFIG, defaultReadConfig);

</script>

<template>
  <n-grid x-gap="12" :cols="2" style="width: 800px">
    <n-grid-item>
      <read-config :config="storageReadConfig"/>
    </n-grid-item>
    <n-grid-item>
      <n-space vertical>
        <other-config :config="storageReadConfig"/>
        <my-accountant/>
      </n-space>
    </n-grid-item>
  </n-grid>

</template>

<style scoped>
.readConfig {
  width: 100%;
  min-height: 200px;
}

.n-input-number {
  width: 100%;
}
</style>
