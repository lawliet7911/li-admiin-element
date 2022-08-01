<script lang="ts" setup>
const router = useRouter();
let title = useTitle()
title.value = router.currentRoute.value.meta.title as string;
</script>

<template>
  <div class="error-page">
    <p>404 Not Found</p>
    <p>页面未找到</p>
  </div>
</template>

<style lang="scss" scoped>
.error-page {
  height: 100%;
  background-color: var(--el-bg-color);
  @include flex-center();
  flex-direction: column;
  p:not(:last-child) {
    font-size: $li-font-size-large;
    line-height: $li-font-size-large;
    font-weight: $li-weight-bold;
    margin-bottom: 20px;
  }
}
</style>

