<template>
  <div class="config-area">
    <n-space vertical>
      <n-space>
        <n-button round type="primary">读</n-button>
      </n-space>
      <n-space>
        <n-button round>配</n-button>
      </n-space>
    </n-space>
  </div>
</template>

<script>
export default {
  name: "app",
};
</script>
<style scoped>
.config-area {
  flex-wrap: wrap;
  position: fixed;
  top: calc(100vh / 2);
  right: 10px;
  z-index: 1024;
}
</style>

