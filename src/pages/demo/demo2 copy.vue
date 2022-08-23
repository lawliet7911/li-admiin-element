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
            <el-button slot="trigger" icon="el-icon-upload2" size="small" type="primary">
              导入车牌号
            </el-button>
          </el-upload>


          <el-button class="allExpListBtn" size="small" type="primary" @click="download2">批量导出二维码2</el-button>
          <span>请确认导入完整的车牌号，例如：鄂AXY001/鄂ADL0001</span>
          <!-- <el-button class="uploadBgBtn" icon="el-icon-upload" type="primary"
            >背景图配置</el-button
          > -->

          <!-- <el-upload
            class="uploadBgBtn"
            action="#"
            style="display: inline-block"
            :auto-upload="false"
            :on-change="changeBgImage"
            :show-file-list="false"
          >
            <el-button icon="el-icon-upload" type="primary"
              >上传背景图</el-button
            >
          </el-upload> -->
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

<script lang="ts" setup>
// import {QRCode} from "qrcodejs2";
// import * as JSZip from "jszip";
// import * as saveAs from "file-saver";
// import * as XLSX from "xlsx";

export default {
  name: 'CodeManage',
  data () {
    return {
      h5Url: "https://taxi-passager-h5.i-xiaoma.com.cn/dist/#/auth",
      bgImage:
        "https://xm-cdn.oss-cn-hangzhou.aliyuncs.com/img/taxi/code_glass.jpeg",
      imgs: [],
      bgimg: null,
      canvas: {},
      w: 2126,
      h: 1063,
      left: 191, //二维码left
      top: 421, //二维码top
      codeW: 387, //二维码宽
      ctx: {},
      zip: {},
      value: [],
      tableData: [],
      total: [],

      map: null,
      currQueen: [],

      completeCount: {},

      pageObj: {
        pageSize: 100,
        total: 0,
        pageNum: 1
      }
    };
  },

  mounted () {
    this.zip = new JSZip();
    this.getBase64(this.bgImage);
  },
  methods: {

    handleSizeChange (size) {
      this.pageObj.pageNum = 1
      this.pageObj.pageSize = size
      this.tableData = this.getTableData(this.pageObj.pageNum, size, this.total);
    },

    handleCurrentChange (num) {
      this.pageObj.pageNum = num
      this.tableData = this.getTableData(this.pageObj.pageNum, this.pageObj.pageSize, this.total);
    },

    getBase64 (imgUrl) {
      let _this = this;
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
            let base64 = e.target.result;
            _this.bgImage = base64;
            _this.drawBgImg();

            // console.log("方式一》》》》》》》》》", base64)
          };
          oFileReader.readAsDataURL(blob);
        }
      };
      xhr.send();
    },

    changeBgImage (file, fileList) {
      const reader = new FileReader();
      reader.readAsDataURL(file.raw);
      reader.onload = e => {
        this.msgSuccess("二维码背景图设置成功");
        this.$refs.bgImg.src = e.target.result;
        this.bgImage = e.target.result;
      };
    },

    // 单图片下载点击事件
    downOneQRCodeImage (item) {
      if (!this.bgImage) {
        this.msgInfo("请选择二维码背景图之后在下载");
        return;
      }
      let carNo = item.carNo;
      let url = `${this.h5Url}?carNo=${carNo}`;
      this.createQRCode(url, carNo, carNo);
    },


    drawBgImg () {
      let that = this;
      let canvas = document.createElement("canvas");
      let ctx = canvas.getContext("2d");
      this.canvas = canvas;
      this.ctx = ctx;
      canvas.width = this.w;
      canvas.height = this.h;
      ctx.rect(0, 0, this.w, this.h);
      ctx.fillStyle = "#fff"; // 填充颜色
      ctx.fill();
      let img = new Image();
      // 防止跨域
      img.setAttribute("crossOrigin", "anonymous");
      img.src = this.$refs.bgImg.src;
      img.onload = function () {
        // 画图
        that.bgimg = img;
        ctx.drawImage(img, 0, 0, that.w, that.h);
      };
    },

    //生成二维码
    createQRCode (url, text, fileName, oneImage = true, zipName) {
      this.$refs.qrcode.innerHTML = "";
      let qrcode = new QRCode(this.$refs.qrcode, {
        width: 420,
        height: 420,
        colorDark: "#000000", //码
        colorLight: "#ffffff", //背景
        correctLevel: QRCode.CorrectLevel.H
      });
      qrcode.clear(); //清除二维码
      qrcode.makeCode(url);

      //找到canvas标签
      let myCanvas = document
        .getElementById("qrcode")
        .getElementsByTagName("canvas");
      // let img=document.getElementById('qrcode').getElementsByTagName('img')
      let qrBase64 = myCanvas[0].toDataURL("image/png");
      return this.drawQRCodeOnBg(qrBase64, text, fileName, oneImage, zipName);
    },

    // 二维码画到背景图
    drawQRCodeOnBg (qrBase64, text, fileName, oneImage, zipName) {
      let that = this;
      return new Promise((resolve, reject) => {
        let img = new Image();
        // 防止跨域
        img.setAttribute("crossOrigin", "anonymous");
        img.src = qrBase64;
        console.log('drawing');
        img.onload = function () {
          that.ctx.fillStyle = "#ffffff"; //白色为例子；
          // 清空
          that.ctx.fillRect(0, 0, that.w, that.h); //画布xy wh
          // 画图
          that.ctx.drawImage(that.bgimg, 0, 0, that.w, that.h); //二维码画布

          that.ctx.drawImage(img, that.left, that.top, that.codeW, that.codeW); //二维码画布

          // 加文字
          that.ctx.font = "bold 64px Microsoft YaHei bolder";
          that.ctx.textAlign = "center";
          that.ctx.fillStyle = "#ec6723";
          that.ctx.fillText(text, 382, 395); //xy

          // 生成图片
          let base64 = that.canvas.toDataURL("image/jpeg");

          if (oneImage) {
            that.downImg(base64, fileName);
          } else {
            that.imgs.push({ url: base64, name: text });
            that.zip.file(fileName + ".jpeg", base64.substring(22), {
              base64: true
            });
            console.log("ok");
            resolve(true);
          }
        };
      })
    },

    // 批量导出二维码
    getExportList () {
      if (!this.bgImage) {
        this.msgInfo("请选择二维码背景图之后再下载");
        return;
      }
      this.loadingInstance = Loading.service({ fullscreen: false });

      this.loadingInstance.close();
      this.exportData = this.tableData;
      setTimeout(() => {
        this.exportData.forEach(item => {
          let carNo = item.carNo;
          let url = `${this.h5Url}?carNo=${carNo}`;
          this.createQRCode(url, carNo, carNo, false);
        });
      }, 0);
    },

    //导入excel
    readExcelCode (file) {
      const fileReader = new FileReader();
      fileReader.onload = ev => {
        try {
          let carNoList = [];
          const data = ev.target.result;
          const workbook = XLSX.read(data, { type: "binary" });
          const wsname = workbook.SheetNames[0]; //取第一张表
          const ws = XLSX.utils.sheet_to_json(workbook.Sheets[wsname]); //生成json表格内容
          let map = new Map();
          ws.forEach(item => {
            let companyName = item["业户名称"];
            let obj = map.get(companyName) || map.set(companyName, []).get(companyName);
            let companyCar = obj;
            companyCar.push(item["车牌号码"])
            carNoList.push({ carNo: item["车牌号码"], company: item["业户名称"] });
          });
          this.map = map;
          this.splitMap(map);
          console.log(map);
          this.total = carNoList
          this.tableData = this.getTableData(this.pageObj.pageNum, this.pageObj.pageSize, this.total);
        } catch (e) {
          console.warn(e);
          this.msgError("文件类型不正确！");
          return false;
        }
      };
      fileReader.readAsBinaryString(file.raw);
    },

    getTableData (page = 1, pageSize = 10, totalData = []) {
      const { length } = totalData;
      const tableData = {
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
          const size = parseInt(length / pageSize);
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
      this.pageObj = {
        total: length,
        pageSize: pageSize,
        pageNum: page
      }
      return tableData.data;
    },

    splitMap (map) {
      let split = 300
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
    },



    // 单个图片下载
    downImg (url, name) {
      var a = document.createElement("a");
      var event = new MouseEvent("click");
      a.download = name || "photo";
      a.href = url;
      a.dispatchEvent(event);
    },

    // new 批量
    async download2 () {
      //
      this.loadingInstance = Loading.service({ fullscreen: false });

      let mapIter = this.map[Symbol.iterator]();
      let task = mapIter.next();
      let [fileName, queue] = task.value;
      let flag = true;
      // let queue = curTaskObj.data;

      while (flag) {
        console.log('loop start-' + fileName);
        await this.loopTask(queue, fileName)

        console.log('next');
        task = mapIter.next()
        console.log(task);
        [fileName, queue] = task.value;
        // queue = curTaskObj.data;
        flag = !task.done;
      }
    },

    loopTask (queue, zipName) {
      let _p = []
      queue.forEach(no => {
        let url = `${this.h5Url}?carNo=${no}`;
        _p.push(this.createQRCode(url, no, no, false, zipName));
      })
      return new Promise((resolve, reject) => {
        Promise.all(_p).then(res => {
          this.zip.generateAsync({ type: "blob" }).then(async (content) => {
            console.log('start download');
            // 生成二进制流
            await saveAs(content, zipName + ".zip"); // 利用file-saver保存文件
            this.imgs = [];
            this.zip.files = [];
            resolve(true)
            // that.loadingInstance.close();
          });
        })
      })
    }
  },
};
</script>

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
