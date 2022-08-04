<script lang="ts" setup name="demo1">
// 2313
let res = ref(1);
const test = () => {
  res.value++;
  console.log(131313);
  console.log(222);
  console.log(333);
  console.log(131314443);
}
</script>
<template>
  <div class="demo">
    demo1
    <el-button @click="test">测试</el-button>
    <el-input v-model="res"></el-input>
  </div>
</template>
<style lang="scss" scoped>
.demo {
  height: 100%;
  background-color: var(--el-bg-color);
}
</style>