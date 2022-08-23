<script lang="ts" setup>

import { QRCode as qr, QRErrorCorrectLevel, QROptions } from '~/utils/qrcode';
import JsZip from "jszip"
import { saveAs } from "file-saver"
import * as XLSX from "xlsx"
import { UploadFile, UploadFiles, UploadProps } from 'element-plus';
let qrcode: any = ref(null);
let bgImg: any = ref(null);


onMounted(() => {
  zip = new JsZip();
  drawBgImg()
})


let tableData = ref([])
let originData:any = []

let pageObj = ref({
  pageSize: 50,
  pageNum: 1,
  total: 0
})

let bgImage = ref('')
let map = new Map();

let ctx: any
let canvas: any
let bgImageElement: HTMLImageElement
const CANVAS_WIDTH: number = 2126
const CANVAS_HEIGHT: number = 1063
const QR_TOP: number = 421
const QR_LEFT: number = 191
const QR_WIDTH: number = 387

const drawBgImg = () => {
  canvas = document.createElement("canvas");
  ctx = canvas.getContext("2d");
  canvas.width = CANVAS_WIDTH;
  canvas.height = CANVAS_HEIGHT;
  ctx.rect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
  ctx.fillStyle = "#fff"; // 填充颜色
  ctx.fill();
  let img = new Image();
  img.setAttribute("crossOrigin", "anonymous");
  img.src = 'https://xm-cdn.oss-cn-hangzhou.aliyuncs.com/img/taxi/code_glass.jpeg'
  img.onload = function () {
    // 画图
    bgImageElement = img;
    ctx.drawImage(img, 0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
  };
}

const readExcelCode: UploadProps['onChange'] = (file: UploadFile, files: UploadFiles) => {
  const fileReader = new FileReader();
  fileReader.onload = ev => {
    try {
      let carNoList: any[] = [];
      const data = (ev as any).target.result;
      const workbook = XLSX.read(data, { type: "binary" });
      const wsname = workbook.SheetNames[0]; //取第一张表
      const ws = XLSX.utils.sheet_to_json(workbook.Sheets[wsname]); //生成json表格内容
      ws.forEach(item => {
        let companyName: string = (item as any)["业户名称"];
        let carNumber: string = (item as any)['车牌号码']
        let obj = map.get(companyName) || map.set(companyName, []).get(companyName);
        let companyCar = obj;
        companyCar.push(carNumber)
        carNoList.push({ carNo: carNumber, company: companyName });
      });
      splitMap(map)
      originData = carNoList
      tableData.value = getTableData(pageObj.value.pageNum, pageObj.value.pageSize, originData);
    } catch (e) {
      // console.warn(e);
      // todo
      // this.msgError("文件类型不正确！");
      return false;
    }
  };
  if (!file) return
  if (!file.raw) return
  fileReader.readAsBinaryString(file.raw);
}

const getTableData = (page = 1, pageSize = 10, totalData: any[] = []) => {
  const { length } = totalData;
  const tableData: any = {
    data: [],
    page,
    pageSize,
    length,
  };
  if (pageSize >= length) {
    tableData.data = totalData;
    tableData.page = 1;
  } else {
    const num = pageSize * (page - 1);
    if (num < length) {
      const startIndex = num;
      const endIndex = num + pageSize - 1;
      tableData.data = totalData.filter((_, index) => index >= startIndex && index <= endIndex);
    } else {
      const size = parseInt(String(length / pageSize));
      const rest = length % pageSize;
      if (rest > 0) {
        tableData.page = size + 1;
        tableData.data = totalData.filter((_, index) => index >= (pageSize * size) && index <= length);
      } else if (rest === 0) {
        tableData.page = size;
        tableData.data = totalData.filter((_, index) => index >= (pageSize * (size - 1)) && index <= length);
      }
    }
  }
  pageObj.value = {
    total: length,
    pageSize: pageSize,
    pageNum: page
  }
  return tableData.data;
}

const FILE_SPLIT_COUNT: number = 300
const splitMap = (map: Map<string, Array<string>>) => {
  let split = FILE_SPLIT_COUNT
  map.forEach((arr, name) => {
    let newArr = []
    for (let i = 0; i < arr.length;) {
      newArr.push(arr.slice(i, i += split));
    }
    if (newArr.length > 1) {
      map.delete(name);
      for (let j = 0; j < newArr.length; j++) {
        let arr = newArr[j];
        map.set(`${name}${(j * split + 1)}-${split > arr.length ? j * split + arr.length : (j + 1) * split
          }`, arr)
      }
    }
  })
}

const downloadBatch = async () => {

  // this.loadingInstance = Loading.service({ fullscreen: false });

  let mapIter = map[Symbol.iterator]();
  let task = mapIter.next();
  let [fileName, queue] = task.value;
  let flag = true;
  // let queue = curTaskObj.data;

  while (flag) {
    console.log('loop start-' + fileName);
    await loopTask(queue, fileName)

    console.log('next');
    task = mapIter.next()
    console.log(task);
    [fileName, queue] = task.value;
    // queue = curTaskObj.data;
    flag = !task.done;
  }
}
let zip: any
let imgs: any[] = []
const createQRCode = (url: string, text: string, fileName: string, oneImage: boolean = true, zipName: string) => {
  qrcode.value.innerHTML = "";
  let codeImg = new qr(qrcode.value, {
    width: 420,
    height: 420,
    colorDark: "#000000", //码
    colorLight: "#ffffff", //背景
    correctLevel: QRErrorCorrectLevel.H
  });
  codeImg.clear(); //清除二维码
  codeImg.makeCode(url);

  //找到canvas标签
  const qrDom = document.getElementById("qrcode")
  let myCanvas = qrDom && qrDom
    .getElementsByTagName("canvas");
  // let img=document.getElementById('qrcode').getElementsByTagName('img')
  let qrBase64 = myCanvas && myCanvas[0].toDataURL("image/png");
  if (!qrBase64) return
  return drawQRCodeOnBg(qrBase64, text, fileName, oneImage, zipName);
}

const drawQRCodeOnBg = (qrBase64: string, text: string, fileName: string, oneImage: boolean, zipName: string) => {
  return new Promise((resolve, reject) => {
    let img = new Image();
    // 防止跨域
    img.setAttribute("crossOrigin", "anonymous");
    img.src = qrBase64;
    console.log('drawing');
    img.onload = function () {
      ctx.fillStyle = "#ffffff"; //白色为例子；
      // 清空
      ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT); //画布xy wh
      // 画图
      ctx.drawImage(bgImageElement, 0, 0, CANVAS_WIDTH, CANVAS_HEIGHT); //二维码画布

      ctx.drawImage(img, QR_LEFT, QR_TOP, QR_WIDTH, QR_WIDTH); //二维码画布

      // 加文字
      ctx.font = "bold 64px Microsoft YaHei bolder";
      ctx.textAlign = "center";
      ctx.fillStyle = "#ec6723";
      ctx.fillText(text, 382, 395); //xy

      // 生成图片
      let base64 = canvas.toDataURL("image/jpeg");

      if (oneImage) {
        downImg(base64, fileName);
      } else {
        imgs.push({ url: base64, name: text });
        zip.file(fileName + ".jpeg", base64.substring(22), {
          base64: true
        });
        console.log("ok");
        resolve(true);
      }
    };
  })
}
const downImg = (url: string, name: string) => {
  var a = document.createElement("a");
  var event = new MouseEvent("click");
  a.download = name || "photo";
  a.href = url;
  a.dispatchEvent(event);
}

const qrBaseUrl = 'https://www.baidu.com'
const loopTask = async (queue: any[], zipName: string) => {
  let _p: any = []
  queue.forEach(no => {
    let url = `${qrBaseUrl}?carNo=${no}`;
    _p.push(createQRCode(url, no, no, false, zipName));
  })
  return new Promise((resolve, reject) => {
    Promise.all(_p).then(res => {
      zip.generateAsync({ type: "blob" }).then(async (content) => {
        console.log('start download');
        // 生成二进制流
        await saveAs(content, zipName + ".zip"); // 利用file-saver保存文件
        imgs = [];
        zip.files = [];
        resolve(true)
        // loadingInstance.close();
      });
    })
  })

}

const downOneQRCodeImage = (item: any) => {
  if (!bgImage) {
    // this.msgInfo("请选择二维码背景图之后在下载");
    return;
  }
  let carNo = item.carNo;
  let url = `${qrBaseUrl}?carNo=${carNo}`;
  createQRCode(url, carNo, carNo, true, '');
}
const handleSizeChange = (size: number) => {
  pageObj.value.pageNum = 1
  pageObj.value.pageSize = size
  tableData.value = getTableData(pageObj.value.pageNum, size, originData);
}

const handleCurrentChange = (num: number) => {
  pageObj.value.pageNum = num
  tableData.value = getTableData(pageObj.value.pageNum, pageObj.value.pageSize, originData);
}


</script>


<template>
  <div class="export-main">
    <div style="position: absolute;margin-top: -10000px;">
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
              <template slot-scope="{row}">
                <el-button type="text" @click="downOneQRCodeImage(row)">下载二维码</el-button>
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
.export-main {
  height: 100%;
  overflow-y: auto;
}

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
