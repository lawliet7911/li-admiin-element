<script setup lang="ts">
let isCollapse = ref(false)
const toggleMenu = useToggle(isCollapse);
</script>

<template>
  <el-container class="home">
    <el-aside width="auto">
      <el-menu :collapse="isCollapse" class="_menu">
        <div class="logo">
          <el-icon @click="toggleMenu()" :size="20">
            <ep-fold v-if="!isCollapse" />
            <ep-expand v-else />
          </el-icon>
        </div>
        <el-menu-item index="1">
          <el-icon>
            <carbon-block-storage />
          </el-icon>
          <span>控制面板</span>
        </el-menu-item>
        <el-sub-menu index="2">
          <template #title>
            <el-icon>
              <ep-location />
            </el-icon>
            <span>Navigator One</span>
          </template>
          <el-menu-item index="1-2">item one</el-menu-item>
          <el-menu-item index="1-3">item one</el-menu-item>

          <el-sub-menu index="1-4">
            <template #title>item four</template>
            <el-menu-item index="1-4-1">item one</el-menu-item>
          </el-sub-menu>
        </el-sub-menu>
        <el-menu-item index="3">
          <el-icon>
            <ep-menu />
          </el-icon>
          <span>Navigator Two</span>
        </el-menu-item>
      </el-menu>
    </el-aside>
    <el-container class="right">
      <el-header class="header" height="70px">
        <Header></Header>
      </el-header>
      <el-main>
        <el-card>
          1231312321312
          el-table
        </el-card>
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


  .logo {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 40px;

    i {
      cursor: pointer;
    }
  }

  .right {
    flex: 1;
  }

  ._menu {
    height: 100vh;
  }
  ._menu:not(.el-menu--collapse) {
    width: 240px;
  }
}
</style>