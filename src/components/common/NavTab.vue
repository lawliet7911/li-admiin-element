<script lang="ts" setup>
import { useTabsStore } from '~/store'

let tabState = useTabsStore()
const close = ()=>{

}
</script>
<template>
  <div class="tab-bar">
    <div v-for="item in tabState.tabs" :key="item.path" :class="{active: item.active}" class="tab-item">
      {{ item.name }}
       <ep-close @click="tabState.closeTab(item.path)" class="close-icon"/>
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
    &.active{
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