<script setup lang="ts">
import { useUserState } from './store';

let isDark = useDark()
// let title = useTitle()
// title.value = 'element-plus模板'
const user = useUserState();
</script>

<template>
  <router-view></router-view>
</template>

<style scoped>
</style>
