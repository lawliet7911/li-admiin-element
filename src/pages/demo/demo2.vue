<script lang="ts" setup>

import { QRCode as qr, QRErrorCorrectLevel, QROptions } from '~/utils/qrcode';

let qrcode: any = ref(null);


onMounted(() => {
  console.log(qr);

  let qrcodeObj = new qr(qrcode.value, <QROptions>{
    width: 420,
    height: 420,
    colorDark: "#000000", //码
    colorLight: "#ffffff", //背景
    correctLevel: QRErrorCorrectLevel.H
  });

  qrcodeObj.clear(); //清除二维码
  qrcodeObj.makeCode('https://www.baidu.com');
})


let tableData = ref([])

let pageObj = ref({
  pageSize: 50,
  pageNum: 1,
  total: 0
})

let bgImage = ref('')

const readExcelCode = () => { }

const downloadBatch = () => { }

const downOneQRCodeImage = () => { }
const handleSizeChange = () => { }

const handleCurrentChange = () => { }

// import * as JSZip from "jszip";
// import * as saveAs from "file-saver";
// import * as XLSX from "xlsx";

</script>


<template>
  <div class="auth-main">
    <div style="position: absolute; margin-top: -10000px;">
      <img ref="bgImg" :src="bgImage" />
      <div id="qrcode" ref="qrcode"></div>
      <canvas style="width: 945px;height: 575px;" id="canvas" ref="canvas" width="2126" height="1063"></canvas>
      <img style="width: 945px;height: 575px;" />
    </div>

    <div class="commcont">
      <div class="table-main">
        <div class="table-top">
          <el-upload class="uploadBtn" ref="upload" action="" :show-file-list="false" :on-change="readExcelCode"
            :auto-upload="false">
            <el-button slot="trigger" type="primary">
              <el-icon size="14">
                <ep-upload />
              </el-icon>
              导入车牌号
            </el-button>
          </el-upload>


          <el-button class="allExpListBtn" type="primary" @click="downloadBatch">
            <el-icon size="14">
              <ep-download />
            </el-icon>
            批量导出二维码
          </el-button>
        </div>
        <div class="table-body">
          <el-table :data="tableData" border style="width: 100%">
            <el-table-column type="index" label="序号"> </el-table-column>
            <el-table-column prop="carNo" label="车牌号"> </el-table-column>
            <el-table-column prop="company" label="企业"> </el-table-column>

            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button type="text" @click="downOneQRCodeImage(scope.row)">下载二维码</el-button>
              </template>
            </el-table-column>
          </el-table>

          <el-pagination class="page-main" background layout="total, prev, pager, next, jumper, sizes"
            @size-change="handleSizeChange" @current-change="handleCurrentChange" :page-size="pageObj.pageSize"
            :current-page="pageObj.pageNum" :page-sizes="[100, 200, 300, 400]" :total="pageObj.total">
          </el-pagination>

        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.table-main {
  padding: 0 15px;
}

.table-top {
  width: 100%;
  height: 30px;
  margin-top: 30px;
  position: relative;
}

.upfileinpbtn {
  width: 100px;
  height: 32px;
  background: #ccc;
  position: absolute;
  z-index: 9;
  left: 150px;
  opacity: 0;
  cursor: pointer;
}

.uploadBtn {
  display: inline-block;
}

.allExpListBtn {
  position: absolute;
  right: 80px;
}

.downBtn {
  position: absolute;
  left: 250px;
}

.uploadBgBtn {
  position: absolute;
  right: 240px;
}

.el-table thead th {
  background: #f5f5f5;
}

.table-body {
  margin-top: 10px;
}

.page-main {
  text-align: center;
  margin: 30px auto;
}

.resTable {
  width: 100%;
  border: 1px solid #ccc;
}

.resTable td {
  border: 1px solid #ccc;
  text-align: center;
  height: 30px;
}

.resTable th {
  border: 1px solid #ccc;
  text-align: center;
  height: 30px;
}

.el-select {
  width: 100%;
}

.el-range-editor--small.el-input__inner {
  width: 100%;
}

.el-checkbox-item {
  display: inline-block;
  margin-left: 15px;
}

.commcont {
  padding-top: 20px;
}

.table-main {
  flex: 1;
  padding: 0 15px;
}

.btn-link {
  display: inline-block;
  color: #fff;
  background-color: #1890ff;
  border-color: #1890ff;
  padding: 10px 15px 9px;
  font-size: 12px;
  border-radius: 4px;
  cursor: pointer;
}

.btn-link:hover {
  background: #46a6ff;
  border-color: #46a6ff;
  color: #fff;
}
</style>
