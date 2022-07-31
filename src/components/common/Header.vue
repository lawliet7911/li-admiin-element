<script lang="ts" setup>

import { useConfigState, useUserState } from '~/store'
const isDark = useDark()
const toggleDark = useToggle(isDark)
let menuState = useConfigState();
let userState = useUserState();

const router = useRouter()
const logout = () => {
  userState.logout()
  router.push({ name: 'Login' })
}

</script>

<template>
  <div class="li-header">
    <el-icon class="toggle-btn cursor-pointer" @click="menuState.toggleCollapse()" :size="20">
      <ep-fold v-if="!menuState.menuCollapse" />
      <ep-expand v-else />
    </el-icon>
    <div class="fn-buttons">
      <el-tooltip content="明暗模式" placement="bottom">
        <div class="fn-icon cursor-pointer" @click="toggleDark()">
          <carbon-sun v-if="isDark" />
          <carbon-moon v-else />
        </div>
      </el-tooltip>
      <el-tooltip content="退出登录" placement="bottom">
        <div class="fn-icon cursor-pointer" @click="logout()">
          <carbon-logout />
        </div>
      </el-tooltip>

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
    display: flex;

    >div {
      margin-left: 15px;
    }
  }

  .fn-icon {
    font-size: 14px;
    color: var(--el-text-color-primary)
  }

}
</style>