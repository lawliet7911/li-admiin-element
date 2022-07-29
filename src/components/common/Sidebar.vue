<script setup lang="ts">import { useConfigState } from '~/store';

let menuState = useConfigState();
</script>


<template>
  <el-menu :collapse="menuState.menuCollapse" class="_menu">
    <div class="logo">
      <span class="sys-logo">
        <carbon-rain-drop/>
      </span>
      <span v-if="!menuState.menuCollapse" class="sys-title">管理系统</span>
    </div>
    <el-menu-item index="1">
      <el-icon>
        <carbon-block-storage />
      </el-icon>
      <span>控制面板</span>
    </el-menu-item>
    <el-sub-menu index="2">
      <template #title>
        <el-icon>
          <ep-location />
        </el-icon>
        <span>导航1</span>
      </template>
      <el-menu-item index="1-2">测试1</el-menu-item>
      <el-menu-item index="1-3">测试2</el-menu-item>

      <el-sub-menu index="1-4">
        <template #title>三级测试</template>
        <el-menu-item index="1-4-1">三级-1</el-menu-item>
      </el-sub-menu>
    </el-sub-menu>
    <el-menu-item index="3">
      <el-icon>
        <ep-menu />
      </el-icon>
      <span>导航2</span>
    </el-menu-item>
  </el-menu>
</template>

<style lang="scss" scoped>
._menu {
  height: 100vh;
}

.logo {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 50px;
  color: var(--el-text-color-primary);
  font-size: 22px;
  .sys-logo {
    position: relative;
    top: 2px;
  }
  .sys-title {
    font-weight: 700;
  }
}

._menu:not(.el-menu--collapse) {
  width: 240px;
}
</style>