<script setup lang="ts">
import { useTabsStore, useUserState } from './store';
import { useLiStorage } from './utils/shared';
useDark()
// 初始化常驻tab菜单
const tabState = useTabsStore();
tabState.initTabs();

// 判断登录是否过期
const userState = useUserState();
let user = useLiStorage.get('user')
let user_expTime = useLiStorage.get('user-expTime')
if (user_expTime < new Date().getTime()) {
  useLiStorage.remove('user')
  useLiStorage.remove('user-expTime')
  userState.setUser({})
}

</script>

<template>
  <router-view v-slot="{ Component }">
    <transition name="login">
      <component :is="Component" />
    </transition>
  </router-view>
</template>