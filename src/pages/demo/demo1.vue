<script lang="ts" setup name="tempTable">
import { simpleTableColumn } from '~/types/table.js';

let list = ref([{
  name: '小王',
  age: '19',
  sex: 1,
  address: '湖北省武汉市',
  account: 'xiaowang',
  birth: '2003-01-30',
}, {
  name: '小红',
  age: '23',
  sex: 0,
  address: '北京',
  account: 'smallred',
  birth: '2000-03-13',
}, {
  name: '小黑',
  age: '24',
  sex: 1,
  address: '四川省成都市',
  account: 'hei',
  birth: '1999-05-17',
},])

let queryForm = ref({
  name: '',
  age: '',
  sex: 1
})

const sexFormatter = (rowData: any, row: any) =>
  rowData[row.property] === 1 ? '男' : '女'

// 如果是简单表格
let tableColumn = ref<simpleTableColumn[]>([
  { label: '序号', prop: 'index', width: 70, align: 'center', type: 'index', visible: true },
  { label: '姓名', prop: 'name', align: 'center', visible: true },
  { label: '年龄', prop: 'age', align: 'center', visible: true },
  { label: '性别', prop: 'sex', align: 'center', visible: true, formatter: sexFormatter },
  { label: '地址', prop: 'address', align: 'center', visible: true },
  { label: '账号', prop: 'account', align: 'center', visible: true },
  { label: '生日', prop: 'birth', align: 'center', visible: true },
])

const visTableColumn = computed(() => tableColumn.value.filter(item => item.visible))
const onQuery = () => { }
</script>
<template>
  <el-container class="temp-table">
    <el-header class="search">
      <el-form :inline="true" :model="queryForm" class="demo-form-inline">
        <el-form-item label="姓名">
          <el-input v-model="queryForm.name" placeholder="姓名" />
        </el-form-item>
        <el-form-item label="年龄">
          <el-input v-model="queryForm.age" placeholder="年龄" />
        </el-form-item>
        <el-form-item label="性别">
          <el-select v-model="queryForm.sex" placeholder="Activity zone">
            <el-option label="男" :value="1" />
            <el-option label="女" :value="0" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onQuery">查询</el-button>
        </el-form-item>
      </el-form>
    </el-header>
    <el-main class="main">
      <el-table :data="list" class="main-table" border>
        <el-table-column v-for="column in visTableColumn" :width="column.width" :key="column.label" :type="column.type"
          :prop="column.prop" :align="column.align" :formatter="column.formatter" :label="column.label" />
      </el-table>
    </el-main>
  </el-container>
</template>
<style lang="scss" scoped>
.temp-table {
  height: 100%;

  .search {
    min-height: 90px;
    height: auto;
    padding: 30px 20px 0;
    box-sizing: border-box;
  }

  .main {}

  .main-table {
    width: 100%;
  }

}
</style>