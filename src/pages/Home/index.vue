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
        <router-view v-slot="{ Component , route }">
          <transition name="sub">
            <keep-alive>
              <component :is="Component" />
            </keep-alive>
          </transition>
        </router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<style scoped lang="scss">
.home {
  height: 100vh;
  display: flex;

  .header {
    height: auto;
    padding: 0;
  }

  .right {
    flex: 1;
  }
}
</style>