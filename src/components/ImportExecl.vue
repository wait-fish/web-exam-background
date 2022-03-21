<template>
  <div class="my_page_pd">
    <div class="my_container">
      <div class="my_flex">
        <div>
          <el-upload
            action=""
            :on-change="handleChange"
            :on-remove="handleRemove"
            :file-list="fileListUpload"
            :limit="limitUpload"
            accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-excel"
            :auto-upload="false"
          >
            <el-button type="primary">导入表格</el-button>
            <div
              slot="tip"
              class="el-upload__tip"
            >只 能 上 传 xlsx / xls 文 件，更 换 文 件 需 删 除 原 来 的</div>
          </el-upload>
        </div>
        <div>
          <el-button
            @click="addData"
            style="width: 100px;"
            type="primary"
          >上传</el-button>
          <el-button @click="$router.go(-1)">取消操作</el-button>
        </div>
      </div>
      <!-- 表格 -->
      <el-table
        class="my_top"
        :data="showData"
        stripe
        style="width: 100%"
        :border=true
      >
        <el-table-column
          v-for="item in cols"
          :key="item"
          :prop="item"
          :label="item"
        >
          <template v-if="item === '状态'">
            <div>
              {{statusArr[statusIndex]}}
            </div>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页器 -->
      <el-pagination class="my_top"
        @current-change="handleCurrentChange"
        :current-page="currentPage"
        :page-size="pageSize"
        layout="total, prev, pager, next, jumper"
        :total="outData.length"
      >
      </el-pagination>
    </div>
  </div>
</template>

<script>
import { getToken } from '../util';
import { colNames } from "../util/colNames";

export default {
  data() {
    return {
      fileListUpload: [],
      limitUpload: 1,
      fileTemp: {},
      outData: [],
      cols: [],
      showData: [],
      colNames,
      statusArr: ["通过", "未通过", "待审核"],
      currentPage: 1,
      pageSize: 20,
      startIndex: 0,
      endIndex: 20,
			statusIndex: 2 // 默认上传状态
    };
  },
  mounted() {
    this.getCols();
  },
  methods: {
    // 获取列名
    async getCols() {
      let { data } = await this.$http.get(
        "/table?name=" + this.$route.query.name
      );
      data = this.filterCol(data.data, ['s_id', 'registration_time']);
      this.cols = data.map((item) => colNames[item]);
      this.colsValue = data;
    },
    // 文件变化时
    handleChange(file) {
      this.fileTemp = file?.raw;
      if (this.fileTemp) {
        if (
          this.fileTemp.type ==
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" ||
          this.fileTemp.type == "application/vnd.ms-excel"
        ) {
          this.importfxx(this.fileTemp);
        } else {
          this.$message({
            type: "warning",
            message: "附件格式错误，请删除后重新上传！",
          });
        }
      } else {
        this.$message({
          type: "warning",
          message: "请上传附件！",
        });
      }
    },
    // 文件删除时
    handleRemove(file, fileList) {
      this.fileTemp = null;
      this.outData = [];
      this.showData = [];
    },
    // 导入表格
    importfxx(obj) {
      // 通过DOM取文件数据
      this.file = obj;
      var rABS = false; //是否将文件读取为二进制字符串
      var f = this.file;
      var reader = new FileReader();
      //if (!FileReader.prototype.readAsBinaryString) {
      FileReader.prototype.readAsBinaryString = (f) => {
        var binary = "";
        var rABS = false; //是否将文件读取为二进制字符串
        var wb; //读取完成的数据
        var reader = new FileReader();
        reader.onload = () => {
          var bytes = new Uint8Array(reader.result);
          var length = bytes.byteLength;
          for (var i = 0; i < length; i++) {
            binary += String.fromCharCode(bytes[i]);
          }
          var XLSX = require("xlsx");
          if (rABS) {
            wb = XLSX.read(btoa(fixdata(binary)), {
              //手动转化
              type: "base64",
            });
          } else {
            wb = XLSX.read(binary, {
              type: "binary",
            });
          }
          this.outData = XLSX.utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]]); //outdata就是你想要的东西
          // console.log(Object.keys(this.outData[0]));
          // 设置表名
          // this.tableNames = Object.keys(this.outData[0]);
          this.showData = this.outData.slice(this.startIndex, this.endIndex);
          // console.log(this.showData);
        };
        reader.readAsArrayBuffer(f);
      };

      if (rABS) {
        reader.readAsArrayBuffer(f);
      } else {
        reader.readAsBinaryString(f);
      }
    },
    // 上传数据到数据库
    async addData() {
      if (!this.outData) return this.$message({
        type: 'warning',
        message: '数据不能为空'
      });
      let rows = [];
      // 拿到有值的索引
      let indexs = Object.keys(this.outData[0]).map((item) =>
        this.cols.findIndex((v) => v === item)
      );
      // console.log(indexs);
      // console.log(this.colsValue);
      // console.log(this.cols);
      // 转换成数组
      this.outData.forEach((v) => {
        let vals = Object.values(v);
        let row = {};
        // 如果键的索引和 有值的索引一样则 赋值
        this.colsValue.forEach((item, index) => {
          row[item] = " ";
          indexs.forEach((i, n) => {
            if (index === i) row[item] = vals[n];
          });
          if (item === "status") row[item] = this.statusIndex;
        });
        rows.push(row);
      });
      // console.log(rows);
      let { name } = this.$route.query;
      let { data } = await this.$http.post(`/${name}/add`, {
        token: getToken().token,
        rows
      });
      let type = data.status === 0 ? 'success' : 'error';
      this.$message({
        type,
        message: `${data.message},总数为${data.data.total}条`
      })
      if (data.status === 0) setTimeout(() => {
        this.$router.replace("/" + name);
      }, 2000);
    },
    handleCurrentChange(e) {
      this.startIndex = this.pageSize * (e - 1);
      this.endIndex = e * this.pageSize <= this.outData.length ? e * this.pageSize : this.outData.length - 1 ;
      this.showData = this.outData.slice(this.startIndex, this.endIndex);
    },
    // 过滤列
    filterCol(data, colName) {
      colName.forEach(item => {
        let i = data.indexOf(item);
        data.splice(i, i);
      });
      // console.log(data);
      return data;
    }
  },
};
</script>
