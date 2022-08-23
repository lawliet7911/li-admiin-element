<script lang="ts" setup>

import { Ref } from 'vue'
import { useConfigState, useUserState } from '~/store'
import { HeaderBtnOption } from '~/types/index'
import Tab from './NavTab.vue';

const isDark = useDark()
const toggleDark = useToggle(isDark)

const { isFullscreen, toggle: toggleFull } = useFullscreen()
let fullText = computed<string>(() => isFullscreen.value ? '退出全屏' : '全屏')

let menuState = useConfigState()
let userState = useUserState()

const router = useRouter()
const logout = () => {
  userState.logout()
  router.push({ name: 'Login' })
}

// 获取ref的原始数据 eg.避免组件参数为string时 传入ref会报警
const getRaw = <T>(value: T | Ref<T> | undefined) => {
  if (value === undefined) return ''
  let result: Ref<T> = isRef(value) ? value as Ref<T> : ref(value) as Ref<T>;
  return toRaw(result.value)
}

// icon属性直接传入图标组件 - issue see - https://github.com/antfu/unplugin-icons/issues/5
let opts = shallowRef<HeaderBtnOption[]>([{
  name: '全屏',
  tooltip: true,
  tip: fullText,
  placement: 'bottom',
  icon: [IconCarbonFitToScreen, IconCarbonMinimize],  // issue
  switch: isFullscreen,
  trigger: toggleFull
}, {
  name: '明暗',
  tooltip: true,
  tip: '明暗模式',
  placement: 'bottom',
  icon: [IconCarbonMoon, IconCarbonSun],
  switch: isDark,
  trigger: () => toggleDark()
}, {
  name: '设置',
  tooltip: true,
  tip: '设置',
  placement: 'bottom',
  icon: [IconCarbonSettings],
  trigger: () => { }
}, {
  name: '退出登录',
  tooltip: true,
  tip: '退出登录',
  placement: 'bottom',
  icon: [IconCarbonLogout],
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
          <el-tooltip :content="getRaw(item.tip)" :placement="item.placement">
            <header-btn-item :option="item"></header-btn-item>
          </el-tooltip>
        </template>
        <template v-else>
          <header-btn-item :option="item"></header-btn-item>
        </template>
      </template>
    </div>
  </div>
  <NavTab />
</template>

<style lang="scss" scoped>
.li-header {
  height: 40px;
  display: flex;
  align-items: center;
  background-color: var(--el-bg-color);
  margin-bottom: 10px;

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