<script setup lang="ts">
import { useUserState } from './store';
import { useLiStorage } from './utils/shared';

let isDark = useDark()
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