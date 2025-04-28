<script setup>

import {getItem} from "@/helper/storageHelper";
import {defaultReadConfig, storageKey} from "@/config/autoReadConfig";
import ReadConfigCard from "@/component/panel/ReadConfigCard.vue";
import OtherConfigCard from "@/component/panel/OtherConfigCard.vue";
import AccountCard from "@/component/panel/AccountCard.vue";

// 从localStorage读取初始化配置
const storageReadConfig = getItem(storageKey.READ_CONFIG, defaultReadConfig);

</script>

<template>
  <n-grid x-gap="12" :cols="2" style="width: 800px">
    <n-grid-item>
      <read-config-card :config="storageReadConfig"/>
    </n-grid-item>
    <n-grid-item>
      <n-space vertical>
        <other-config-card :config="storageReadConfig"/>
        <account-card/>
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
