<script setup>
defineProps({
  title: {
    type: String,
    default: '-'
  },
  value: {
    type: String,
    default: '-'
  },
  unit: {
    type: String,
    default: '-'
  }
})
</script>

<template>
  <div class="account-info">
    <n-space vertical>
      <span>{{ title }}</span>
      <strong style="color: grey"><span class="count-number">{{ value }}</span> {{ unit }}</strong>
    </n-space>
  </div>
</template>

<style scoped>
.account-info {
  border: lightgray solid 1px;
  border-radius: 4px;
  padding: 2px 10px;
}

.count-number {
  font-size: 25px;
}

</style>
