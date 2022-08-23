<script lang="ts" setup>

import { QRCode as qr, QRErrorCorrectLevel } from '~/utils/qrcode';
import JsZip from "jszip"
import { saveAs } from "file-saver"
import * as XLSX from "xlsx"
import { UploadFile, UploadFiles, UploadProps } from 'element-plus';
let qrcode: any = ref(null);
let bgImg: any = ref(null);

// step 1.select xlsx file to get the origin data
// step 2.choose image as the qrcode background image
// step 3.use the step 2 image as background,drag label & qrcode get x,y and other settings
// step 4.download and show progress

// 1 -  4
// TODO extract step1-2 and step-4 functions and complete step3 drag qrcode position and settings
const step = ref<number>(0)

onMounted(() => {
})


let tableData = ref([])
let originData: any[] = []

let pageObj = ref({
  pageSize: 50,
  pageNum: 1,
  total: 0
})

const handleSizeChange = (size: number) => {
  pageObj.value.pageNum = 1
  pageObj.value.pageSize = size
  tableData.value = getTableData(pageObj.value.pageNum, size, originData);
}

const handleCurrentChange = (num: number) => {
  pageObj.value.pageNum = num
  tableData.value = getTableData(pageObj.value.pageNum, pageObj.value.pageSize, originData);
}

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
  img.src = bgImage.value
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
      // splitMap(map) todo
      originData = carNoList
      tableData.value = getTableData(pageObj.value.pageNum, pageObj.value.pageSize, originData);
      step.value++
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

const getBase64 = (imgUrl: string) => {
  window.URL = window.URL || window.webkitURL;
  var xhr = new XMLHttpRequest();
  xhr.open("get", imgUrl, true);
  // 至关重要
  xhr.responseType = "blob";
  xhr.onload = function () {
    if (this.status == 200) {
      //得到一个blob对象
      var blob = this.response;
      // 至关重要
      let oFileReader = new FileReader();
      oFileReader.onloadend = function (e) {
        if (!e.target) return
        let base64 = e.target.result;
        bgImage.value = base64 as string;
        drawBgImg();

        // console.log("方式一》》》》》》》》》", base64)
      };
      oFileReader.readAsDataURL(blob);
    }
  };
  xhr.send();
}

const chooseImage: UploadProps['onChange'] = (file: UploadFile) => {
  const reader = new FileReader();
  if (!file.raw) return
  reader.readAsDataURL(file.raw);
  reader.onload = e => {
    // this.msgSuccess("二维码背景图设置成功");
    if (!e.target) return
    bgImg.value.src = e.target.result;
    bgImage.value = e.target.result as string;
    drawBgImg()
    step.value++
  };
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
  let mapIter = map[Symbol.iterator]();
  let task = mapIter.next();
  let [fileName, queue] = task.value;
  let flag = true;

  while (flag) {
    console.log('Loop start-' + fileName);
    await loopTask(queue, fileName)

    task = mapIter.next()
    flag = !task.done;
    if (!flag) {
      console.log('DONE');
      break
    } else {
      console.log('NEXT MAP');
    }
    [fileName, queue] = task.value;
  }
}
const zip: JsZip = new JsZip();

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

const CANVAS_PARAMS: number[] = [0, 0, CANVAS_WIDTH, CANVAS_HEIGHT]
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
      ctx.fillRect(...CANVAS_PARAMS); //画布xy wh
      // 画图
      ctx.drawImage(bgImageElement, ...CANVAS_PARAMS); //二维码画布

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

const preStep = () => {
  step.value--
}
const nextStep = () => {
  step.value++
}
const startExport = () => {
  downloadBatch()
  // last
  step.value++ // set status finished
}


</script>


<template>
  <div class="export-main">
    <!-- step-bar -->
    <el-steps :active="step" simple finish-status="success">
      <el-step title="选择批量导出文件" />
      <el-step title="选择背景图片" />
      <el-step title="设置参数和位置" />
      <el-step title="导出" />
    </el-steps>

    <!-- step -->
    <div class="step" v-if="step === 0">
      <div class="step-title">请选择需要批量生成二维码的Excel文件</div>
      <div class="upload-container">
        <el-upload drag accept=".xlsx" :show-file-list="false" :auto-upload="false" :on-change="readExcelCode">
          <el-icon class="el-icon--upload">
            <ep-upload-filled />
          </el-icon>
          <div class="el-upload__text">
            将批量生成二维码的文件拖拽到此处 or <em>点击选择</em>
          </div>
        </el-upload>
      </div>

    </div>

    <div class="step" v-else-if="step === 1">
      <div class="step-title">请选择二维码背景图</div>
      <div class="upload-container">
        <el-upload drag accept=".png,.jpeg,.jpg" :show-file-list="false" :auto-upload="false" :on-change="chooseImage">
          <el-icon class="el-icon--upload">
            <ep-upload-filled />
          </el-icon>
          <div class="el-upload__text">
            拖拽二维码背景图到此处 or <em>点击选择</em>
          </div>
        </el-upload>
      </div>
    </div>

    <div class="step" v-else-if="step === 2">
      STEP3
    </div>

    <div class="step" v-else-if="step === 3">
      STEP4
    </div>

    <div class="step-buttons">
      <el-button type="primary" @click="preStep()" v-if="step !== 0">上一步</el-button>
      <!-- <el-button type="primary" @click="nextStep()" v-if="step !== 3">下一步</el-button> -->
      <el-button type="primary" @click="startExport()" v-if="step === 2">
        <!-- <el-button type="primary" @click="startExport()" v-if="step === 3"> -->
        <el-icon>
          <ep-download />
        </el-icon>
        导出
      </el-button>
    </div>

    <!-- <div> -->
    <div style="position: absolute;margin-top: -10000px;">
      <img ref="bgImg" :src="bgImage" />
      <div id="qrcode" ref="qrcode"></div>
      <canvas style="width: 945px;height: 575px;" id="canvas" ref="canvas" width="2126" height="1063"></canvas>
      <img style="width: 945px;height: 575px;" />
    </div>

    <div class="commcont" v-if="false">
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

<style lang="scss" scoped>
.export-main {
  height: 100%;
  overflow-y: auto;

  .step {
    min-height: 300px;

    .step-title {
      font-size: 22px;
      padding: 20px 20px 0;
      text-align: center;
      font-weight: 500;
    }
  }

  .step-buttons {
    display: flex;
    justify-content: center;
  }
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

.el-range-editor--small.el-input__inner {
  width: 100%;
}

.el-checkbox-item {
  display: inline-block;
  margin-left: 15px;
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

/* step */
.upload-container {
  padding: 20px;

}

:deep(.el-step__title) {
  text-overflow: ellipsis;
  word-break: keep-all !important;
  overflow: hidden;
}
</style>
