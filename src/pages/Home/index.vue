<script setup lang="ts">
</script>

<template>
  <el-container class="home">
    <el-aside width="auto">
      <Sidebar></Sidebar>
    </el-aside>
    <el-container class="right">
      <el-header class="header">
        <Header></Header>
      </el-header>
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<style scoped lang="scss">
.home {
  height: 100vh;
  display: flex;

  .header {
    padding: 0;
  }

  .right {
    flex: 1;
  }
}
</style>