<script lang="ts" setup>

import { useConfigState } from '~/store'
const isDark = useDark()
const toggleDark = useToggle(isDark)
let menuState = useConfigState();

// let menuState = useMenu
</script>

<template>
  <div class="li-header">
    <el-icon class="toggle-btn" @click="menuState.toggleCollapse()" :size="20">
      <ep-fold v-if="!menuState.menuCollapse" />
      <ep-expand v-else />
    </el-icon>
    <div class="fn-buttons">
      <div class="fn-icon" @click="toggleDark()">
        <carbon-sun v-if="isDark" />
        <carbon-moon v-else />
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.li-header {
  height: 60px;
  display: flex;
  align-items: center;
  box-shadow: var(--el-box-shadow-light);
  background-color: var(--el-bg-color);
  color: var(--el-text-color-primary);
  .toggle-btn {
    margin-left: 20px;
  }

  .fn-buttons {
    padding: 0 20px;
    position: absolute;
    right: 0;
  }

  .fn-icon {
    font-size: 14px;
    cursor: pointer;
    color: var(--el-text-color-primary)
  }

}
</style>