<script lang="ts" setup>

import { useConfigState, useUserState } from '~/store'
import { HeaderBtnOption } from '~/types/index';

const isDark = useDark()
const toggleDark = useToggle(isDark)

const { isFullscreen, toggle: toggleFull } = useFullscreen()
let fullText = computed(() => isFullscreen.value ? '退出全屏' : '全屏')

let menuState = useConfigState();
let userState = useUserState();

const router = useRouter()
const logout = () => {
  userState.logout()
  router.push({ name: 'Login' })
}

let opts = ref<HeaderBtnOption[]>([{
  name: '全屏',
  tooltip: true,
  tip: fullText,
  placement: 'bottom',
  icon: [IconCarbonFitToScreen, IconCarbonMinimize], // issue see - https://github.com/antfu/unplugin-icons/issues/5
  switch: isFullscreen,
  trigger: toggleFull
}, {
  name: '明暗',
  tooltip: true,
  tip: '明暗模式',
  placement: 'bottom',
  icon: [IconCarbonMoon, IconCarbonSun], // issue see - https://github.com/antfu/unplugin-icons/issues/5
  switch: isDark,
  trigger: () => toggleDark()
}, {
  name: '退出登录',
  tooltip: true,
  tip: '退出登录',
  placement: 'bottom',
  icon: [IconCarbonLogout], // issue see - https://github.com/antfu/unplugin-icons/issues/5
  trigger: logout
}])

</script>

<template>
  <div class="li-header">
    <el-icon class="toggle-btn cursor-pointer" @click="menuState.toggleCollapse()" :size="20">
      <ep-fold v-if="!menuState.menuCollapse" />
      <ep-expand v-else />
    </el-icon>
    <div class="fn-buttons">
      <template v-for="item in opts" :key="item.name">
        <template v-if="item.tooltip">
          <el-tooltip :content="item.tip" :placement="item.placement">
            <header-btn-item :option="item"></header-btn-item>
          </el-tooltip>
        </template>
        <template v-else>
          <header-btn-item :option="item"></header-btn-item>
        </template>
      </template>

      <!-- <el-tooltip :content="fullText" placement="bottom">
        <div class="fn-icon cursor-pointer" @click="toggleFull()">
          <carbon-minimize v-if="isFullscreen" />
          <carbon-fit-to-screen v-else />
        </div>
      </el-tooltip>
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
      </el-tooltip> -->

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