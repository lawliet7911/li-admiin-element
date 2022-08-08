<script setup lang="ts">import { useConfigState } from '~/store';

let menuState = useConfigState();
</script>


<template>
  <div class="logo">
    <span class="sys-logo">
      <carbon-rain-drop />
    </span>
    <Transition name="mt">
      <span v-if="!menuState.menuCollapse" class="sys-title">管理系统</span>
    </Transition>
  </div>
  <el-menu :collapse="menuState.menuCollapse" class="_menu">
    <router-link to="/">
      <el-menu-item index="1">
        <el-icon>
          <carbon-block-storage />
        </el-icon>
        <span>控制面板</span>
      </el-menu-item>
    </router-link>
    <el-sub-menu index="2">
      <template #title>
        <el-icon>
          <ep-location />
        </el-icon>
        <span>Demos</span>
      </template>
      <router-link to="/demo1">
        <el-menu-item index="1-2">demo1</el-menu-item>
      </router-link>
       <router-link to="/demo2">
        <el-menu-item index="1-2">demo2</el-menu-item>
      </router-link>
      <!-- 404 -->
      <router-link to="/demo404">
        <el-menu-item index="1-3">404page</el-menu-item>
      </router-link>

      <el-sub-menu index="1-4">
        <template #title>三级测试</template>
        <el-menu-item index="1-4-1">三级-1</el-menu-item>
      </el-sub-menu>
    </el-sub-menu>
  </el-menu>
</template>

<style lang="scss" scoped>
._menu {
  height: calc(100vh - 60px);
}

.logo {
  @include flex-center();
  height: 60px;
  color: var(--el-text-color-primary);
  background-color: var(--el-bg-color);
  font-size: 22px;
  overflow: hidden;
  border-right: solid 1px var(--el-menu-border-color);

  .mt-enter-active {
    transition: all var(--el-transition-duration) ease-out;
  }

  .mt-leave-active {
    position: absolute;
    transition: all var(--el-transition-duration) var(--el-transition-function-ease-in-out-bezier);
  }

  .mt-enter-from,
  .mt-leave-to {
    transform: translateY(-20px);
    opacity: 0;
  }

  .sys-logo {
    position: relative;
    top: 2px;
  }

  .sys-title {
    font-weight: 700;
    text-overflow: ellipsis;
    word-break: keep-all;
  }
}


._menu:not(.el-menu--collapse) {
  width: 240px;
}
</style>