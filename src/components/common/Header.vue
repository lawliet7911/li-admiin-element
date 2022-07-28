<script lang="ts" setup>

const isDark = useDark()
const toggleDark = useToggle(isDark)

</script>

<template>
  <div class="li-header">
    <el-button @click="toggleDark()">
      <carbon-sun class="dark-icon"></carbon-sun>
    </el-button>
  </div>
</template>

<style lang="scss" scoped>
.li-header {
  height: 70px;
  display: flex;
  align-items: center;
  background-color: var(--el-color-primary-light-8);
  .dark-icon {
    font-size: 20px;
    cursor: pointer;
  }
}
</style>