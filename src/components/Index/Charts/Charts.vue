<template>
  <div class="my_page_pd">
    <Tab className="my_container" title="数据可视化" />
    <div class="my_container"> 
      <!-- 总数 -->
      <el-row :gutter="0" type="flex" justify="space-around">
        <el-col :span="6">
          <div class="grid-content bg-grid-1">
            <div class="grid-title">
              <h3 class="title-number">{{exam_type_count}}</h3>
              <span class="title-tips">开设考试类型</span>
            </div>
            <span class="iconfont icon-lvzhou_zongshu
"></span>
          </div>
        </el-col>
        <el-col :span="8">
          <div class="grid-content bg-grid-2">
            <div class="grid-title">
              <h3 class="title-number">{{year_count}}</h3>
              <span class="title-tips">{{year}}年总参加人数</span>
            </div>
            <span class="iconfont icon-zhuanye"></span>
          </div>
        </el-col>
        <el-col :span="6">
          <div class="grid-content bg-grid-3">
            <div class="grid-title">
              <h3 class="title-number">{{total_count}}</h3>
              <span class="title-tips">历史参加人数</span>
            </div>
            <span class="iconfont icon-xueshengxinxicaiji"></span>
          </div>
        </el-col>
      </el-row>
      <div class="charts_box my_top">
        <el-row >
          <el-cascader
            v-model="class_info"
            :options="class_options"
            :props="{ checkStrictly: true }"
            clearable
          ></el-cascader>
          <el-cascader
            style="margin-left:10px;"
            v-model="exam_info"
            :options="exam_options"
            :props="{ checkStrictly: true }"
            clearable
          ></el-cascader>
          <el-button style="margin-left:10px;" @click="init" type="primary">确定</el-button>
        </el-row>
        <el-row class="my_top">
          <el-col :span="12">
            <div ref="exam_pass_rate"></div>
          </el-col>
          <el-col :span="12">
            <div ref="theory_pass_rate"></div>
          </el-col>
        </el-row>
        <el-row class="charts_box">
          <el-col :span="12">
            <div ref="practice_pass_rate"></div>
          </el-col>
          <el-col :span="12">
            <div ref="exam_number"></div>
          </el-col>
        </el-row>
      </div>
    </div>
  </div>
</template>

<script>
import Tab from '../../Tab.vue';
import * as echarts from 'echarts';
import { findIndexs, findValues } from "../../../util/find.js"

export default {
  data() {
    return {
      chartsWH: {
        width: 500, height: 300
      },
      exam_type_count: 0,
      year_count: 0,
      total_count: 0,
      year: new Date().getFullYear(),
      class_options: [],
      class_info: ['计算机应用技术', new Date().getFullYear()], // 专业信息
      exam_options: [],
      exam_info: ['web前端开发', '初级'],
			specialty: '' // 专业
    }
  },
  components: {
    Tab
  },
  mounted() {
    this.initData()
  },
  methods: {
		async initData() {
			await this.getMenu();
			await this.getExamInfo();
			this.class_info = findIndexs(this.class_options, this.class_info)
			this.exam_info = findIndexs(this.exam_options, this.exam_info)
			this.getExamTypeCount();
			this.getYearCount();
			this.getTotalCount();
			this.init();
		},
    init() {
      this.initExamPassRate(this.$refs.exam_pass_rate, {
        title: '证书通过率',
        type: ''
      });
      this.initExamPassRate(this.$refs.theory_pass_rate, {
        title: '理论通过率',
        type: 'theory',
        color: ['#73c0df', '#FF6A6A']
      });
      this.initExamPassRate(this.$refs.practice_pass_rate, {
        title: '实操通过率',
        type: 'practice',
        color: ['#49a8f7', '#FF6A6A']
      });
			this.exam_number();
    },
    // 获取饼图数据
    async getData(path, type = '') {
      let params = '?';
			const class_info = findValues(this.class_options, this.class_info)
			const exam_info = findValues(this.class_options, this.exam_info)
      params += this.isEmpty(class_info[0]) ? '' : `specialty=${class_info[0]}`;
      params += this.isEmpty(class_info[1]) ? '' : `&year=${class_info[1]}`;
      params += this.isEmpty(class_info[2]) ? '' : `&class=${class_info[2]}`;
      params += this.isEmpty(exam_info[0]) ? '' : `&exam_type=${exam_info[0]}`;
      params += this.isEmpty(exam_info[1]) ? '' : `&exam_level=${exam_info[1]}`;
      params += `&type=${type}`;
      // console.log(path + params);
      let { data } = await this.$http.get(path + params);
      // console.log(data);
      return data.data;
    },
    // 通过率饼图函数
    async initExamPassRate(el, options) {
      const data = await this.getData('/score/passed_rate', options.type);
      var myChart = echarts.init(el, null, this.chartsWH);
      myChart.setOption({
        tooltip: {
          trigger: 'item'
        },
        title: {
          text: options.title || '通过率'
        },
        color: options.color || [
          '#a9f576',
          '#FF6A6A'
        ],
        legend: {  
          orient : 'vertical',  
          x : 'left',  
          top: 200,
          itemWidth:70,
          itemHeight:30,
          formatter: '{name}',
          textStyle:{
              color: '#333'
          },
          data:[{name:'通过',icon:'rect'},{name:'不通过',icon:'rect'}]  
        },   
        series: [
          {
            center: ['45%', '50%'],
            label: {
              show: true,
              formatter:'{d}%'
            },
            type: 'pie',
            data
          }
        ]
      });
    },
    // 柱图函数
    async exam_number() {
			this.specialty = findValues(this.class_options, this.class_info)[0] || ''
			const param = this.specialty ? `?specialty=${this.specialty}` : '';
			// console.log(param);
      const { data } = await this.$http.get('/student/exam_number' + param);
      // console.log(data);
      var myChart = echarts.init(this.$refs.exam_number, null, this.chartsWH);
      myChart.setOption({
      title: {
        text: `${this.specialty ? this.specialty + '专业' : ''} 近${data.data[0].length}年报名人数统计图`
      },
      color: [
        '#b6b7e9'
      ],
      tooltip: {},
      xAxis: {
        data: data.data[0]
      },
      yAxis: {},
      series: [{
        center: ['70%'],
        name: '人数',
        type: 'bar',
        data: data.data[1]
      }]
    });
    },
    async getExamTypeCount() {
      let { data } = await this.$http.get('/exam_type/count');
      this.exam_type_count = data.data.count;
    },
    async getYearCount() {
      let { data } = await this.$http.get('/student/count?year=' + this.year);
      this.year_count = data.data.count;
    },
    async getTotalCount() {
      let { data } = await this.$http.get('/student/count');
      this.total_count = data.data.count;
    },
    // 获取菜单
    async getMenu() {
      let { data } = await this.$http.get('/menu/select');
      // console.log(data);
      this.class_options = data.data;
    },
    async getExamInfo() {
      let { data } = await this.$http.get('/exam_type/select');
       this.exam_options = data.data;
    },
    isEmpty(value) {
      return value === '' || value === undefined || value === 'undefined'
    }
  }
}
</script>

<style lang="scss" scoped>
.grid-content {
  background-color: bisque;
  border-radius: 20px;
  color: #fff;
  min-height: 120px;
  display: flex;
  justify-content: space-evenly;
  align-items: center;
  padding: 10px;
  min-width: 220px;
  box-shadow: 5px 5px 15px rgba($color: #000000, $alpha: .1);

  .grid-title {
    font-size: 36px;
    margin-right: 10px;

    .title-number {
      margin-left: 20px;
      transform: translateY(10px);
    }
    .title-tips {
      font-size: 22px;
    }
  }

  .iconfont {
    font-size: 60px;
  }

}
.bg-grid-1 {
  background-color: rgb(169, 245, 118);
}
.bg-grid-2 {
  background-color: var(--color);
}
.bg-grid-3 {
  background-color: rgb(245, 195, 101);
}
.charts_box {
  padding-top: 20px;
  border-top: 1px solid #eee;
}
</style>