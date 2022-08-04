<script lang="ts" setup>
import type { RouteRecordName } from 'vue-router';
import { useTabsStore } from '~/store'

let tabState = useTabsStore()
let router = useRouter()
const close = async (name: RouteRecordName | null | undefined) => {
  if(!name) return
  let to = await tabState.closeTab(name)
  if (!to) return
  router.push(to)
}

const activeTab = (path: string): void => {
  router.push({ path })
}

</script>
<template>
  <div class="tab-bar">
    <div v-for="(item, name) in tabState.tabs" :key="item.path" @click.stop="activeTab(item.path)"
      :class="{ active: item.active }" class="tab-item">
      {{ item.meta.title }}
      <ep-close @click.stop="close(item.name)" v-if="(name as any) != 'DashBoard'" class="close-icon" />
    </div>
  </div>
</template>
<style lang="scss" scoped>
.tab-bar {
  display: flex;
  padding: 0 20px;
  height: 30px;

  .tab-item {
    display: inline-block;
    padding: 0 25px 0 10px;
    height: 30px;
    background: var(--el-color-info-light-7);
    line-height: 30px;
    font-size: var(--el-font-size-small);
    transition: all .3s;
    cursor: pointer;
    box-sizing: border-box;
    position: relative;
    border-radius: 6px;
    min-width: 100px;

    &.active {
      background-color: var(--el-bg-color);
    }

    &:not(:last-child) {
      margin-right: 2px;
    }

    text-align: left;
    top: 0;

    .close-icon {
      cursor: pointer;
      font-size: 12px;
      position: absolute;
      right: 3px;
      top: 3px;
      display: none;
    }

    &:hover {
      .close-icon {
        display: block;
      }
    }
  }
}
</style>