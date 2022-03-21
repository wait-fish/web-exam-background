<template>
    <el-button
      @click="getExecl"
      :disabled="this.outData.length === 0"
      :size="size || 'big'"
      type="info"
    >{{execlName}}</el-button>
</template>

<script>
import { filterCols } from '../util/filter';

export default {
  data() {
    return {
      mTableNames: []
    }
  },
  props: {
    outData: {
      type: Array,
      value: []
    },
    tableNames: {
      type: Array,
      value: []
    },
    size: {
      type: '',
      value: String
    },
    filterColNames: {
      type: Array,
      value: []
    },
    execlName: {
      type: String,
      value: '导出表格'
    }
  },
  methods: {
    getExecl() {
      // 此处的转换是把vue对象转为普通对象，去除数据拦截
      let data = filterCols(JSON.parse(JSON.stringify(this.outData)), this.filterColNames);
      this.jsonToExcel(data, this.tableNames);
    },
    /**
     * 导出 json 数据为 Excle 表格
     * @param {json} data 要导出的 json 数据
     * @param {String} head 表头, 可选 参数示例：'名字,邮箱,电话'
     * @param {*} name 导出的文件名, 可选
     */
    jsonToExcel(data, head, name = "导出的文件") {
      let str = "";
      // 表头处理
      head.forEach((item) => (str += item + "\t"));
      str += "\n";
      // 转字符串写入
      data.forEach((item) => {
        // 拼接json数据, 增加 \t 为了不让表格显示科学计数法或者其他格式
        for (let key in item) {
          str = `${str + item[key] + "\t"}`;
        }
        str += "\n";
      });
      str += '提示，身份证和学号等需要将列格式设为数值，小数点位数设为0。'
      // console.log(str);
      // encodeURIComponent解决中文乱码
      const uri =
        "data:text/csv;charset=utf-8,\ufeff" + encodeURIComponent(str);
      // 通过创建a标签实现
      const link = document.createElement("a");
      link.href = uri;
      // 对下载的文件命名
      link.download = `${name + ".xlsx"}`;
      link.click();
    }
  }
};
</script>