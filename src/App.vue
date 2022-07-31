<script setup lang="ts">
import { useUserState } from './store';
import { useLiStorage } from './utils/shared';

let isDark = useDark()
const userState = useUserState();
// let title = useTitle()
// title.value = 'element-plus模板'
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

<style lang="scss" scoped>
$--login-animation-duration: .45s;

.login-enter-active {
  transition: all $--login-animation-duration ease-out;
}

.login-leave-active {
  opacity: 0;
}

.login-enter-from,
.login-leave-to {
  transform: translateX(-100px);
  opacity: 0;
}
</style>
