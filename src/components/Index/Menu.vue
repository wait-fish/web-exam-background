<template>
  <div class="my_page_pd">
     <Tab
      title="选项管理"
      className="my_container"
    />
    <el-tabs class="my_container" v-model="activeName" >
      <el-tab-pane label="专业年级管理" name="first">
        <el-row class="left_small my_top">
        <el-col :span="9" class="my_flex" v-if="myUser.useraccount === 'admin'">
          <el-input placeholder="请输入添加专业如：(计算机软件技术)" v-model="specialty_value" />
          <el-button @click="addSpecialty()" class="left_small" type="primary">添加</el-button>
        </el-col>
        <el-col v-else style="color: #ccc;font-size: 14px;">只有系统超级管理员可以操作</el-col>
      </el-row>
      <ul class="left_line left_small my_top">
        <!-- 专业 -->
        <li class="top" v-for="item in menu" :key="item.specialty">
          <el-tag
            :disable-transitions="false"
            :closable="myUser.useraccount === 'admin'"
            @close="handleDel({specialty: item.specialty})">
            {{item.specialty}}专业
          </el-tag>
          <ul>
            <!-- 年级 -->
            <li class="left top" v-for="item2 in item.children" :key="item2.year">
               <el-tag
                class="horizontal_line"
                type="success"
                :disable-transitions="false"
                :closable="myUser.useraccount === 'admin'"
                @close="handleDel({specialty: item.specialty, year: item2.year})">
                {{item2.year}}级
              </el-tag>
              <!-- 班级 -->
              <ul class="my_class_box">
                <li :class="index === 0 ? 'left top' : 'left_small top'" v-for="(item3, index) in item2.children" :key="item3.year">
                <el-tag
                  :class="index === 0 ? 'horizontal_line vertical_line' : ''"
                  type="warning"
                  :disable-transitions="false"
                  :closable="myUser.useraccount === 'admin'"
                  @close="handleDel({ id: item3.id })">
                  {{item.specialty}}{{item3.class}}班
                </el-tag>
                </li>
                <!-- 添加班级 -->
                <div class="left_small top" v-if="myUser.useraccount === 'admin'">
                  <el-input
                    v-if="inputVisibleClass[item2.year +'_' + item.specialty]"
                    v-model="class_value"
                    ref="saveTagInput"
                    size="small"
                    @keyup.enter.native="handleInputConfirm(item2.year +'_' + item.specialty, 'class')"
                    @blur="hideInput(item2.year +'_' + item.specialty, 'class')"
                    style="width: 80px;"
										placeholder="例:A"
                  >
                  </el-input>
                  <el-button 
                  v-else  
                  size="small" 
                  @click="showInput(item2.year +'_' + item.specialty, 'class')"
                  >+ New Class</el-button>
                </div>
              </ul>
            </li>
            <!-- 添加年级 -->
            <div class="left top" v-if="myUser.useraccount === 'admin'">
              <el-input
                class="horizontal_line"
                v-if="inputVisibleYear[item.specialty]"
                v-model="year_value"
                ref="saveTagInput"
                size="small"
                @keyup.enter.native="handleInputConfirm(item.specialty, 'year')"
                @blur="hideInput(item.specialty, 'year')"
                style="width: 80px;"
								placeholder="例:2022"
              >
              </el-input>
              <el-button class="horizontal_line" 
              v-else  
              size="small" 
              @click="showInput(item.specialty, 'year')"
              >+ New Year</el-button>
            </div>
          </ul>
        </li>
      </ul>
      </el-tab-pane>
      <!-- 考试类型管理 -->
      <el-tab-pane label="考试类型管理" name="exam">
        <el-row class="left_small my_top">
        <el-col :span="9" class="my_flex" v-if="myUser.useraccount === 'admin'">
          <el-input placeholder="请输入考试类型如：(web前端开发)" v-model="exam_type_value" />
          <el-button @click="addExamType()" class="left_small" type="primary">添加</el-button>
        </el-col>
        <el-col v-else style="color: #ccc;font-size: 14px;">只有系统超级管理员可以操作</el-col>
      </el-row>
      <el-table
        class="my_top"
        :data="exam_type"
        stripe
        style="width: 100%">
        <el-table-column
          prop="exam_type"
          label="考试类型"
          width="180">
        </el-table-column>
        <el-table-column
          prop="exam_level"
          label="考试等级"
          >
          <template slot-scope="scope">
            <el-tag
            :type="tagType[index]"
            v-for="(item, index) in scope.row.children" 
            class="left_small" 
            :key="item.id"
            :disable-transitions="false"
            :closable="myUser.useraccount === 'admin'"
            @close="handleDelExamType({
              exam_type: scope.row.exam_type,
              exam_level: item.exam_level
            })">
              {{item.exam_level}}
            </el-tag>
          </template>
        </el-table-column>
         <el-table-column
          label="操作"
          width="180">
          <template slot-scope="scope">
            <el-button 
            @click="handleDelExamType({
              exam_type: scope.row.exam_type
            })" 
            v-if="scope.row.useraccount!=='admin'" 
            size="mini" type="info" 
            :disabled="myUser.useraccount !== 'admin'">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import { getToken } from '../../util';
import Tab from "../Tab.vue";

export default {
  data() {
    return {
      myUser: {},
      menu: [],
      defaultProps: {
        children: "children",
        label: "label",
      },
      specialty_value: '',
      class_value: '',
      year_value: '',
      inputVisibleYear: {}, // 添加标签按钮显示
      inputVisibleClass: {},
      inputName: '', // 输入框名
      activeName: 'first',
      tagType: [
        'primary',
        'success',
        'warning'
      ],
      exam_type: [],
      exam_type_value: ''
    }
  },
  components: {
    Tab,
  },
  mounted() {
    this.getMenu();
    this.myUser = getToken();
    this.getExamType();
  },
  methods: {
    async getMenu() {
      const { data } = await this.$http.get("/menu");
      this.menu = data.data;
    },
    // 删除
    async handleDel(params) {
      let { data } = await this.$http.post("/menu/remove", {
        token: this.myUser.token,
        ...params
      });
      // console.log(data);
      const { status, message } = data;
      var type = status === 0 ? 'success' : 'error' ;
      this.$message({ type, message });
      if (status === 0) this.getMenu();
    },
    // 显示输入框
    showInput(item, type) {
      let name = type === 'year' ? 'inputVisibleYear' : 'inputVisibleClass';
      this[name][item] = true;
      this[name] = Object.assign({}, this[name]);
    },
    handleInputConfirm(item, type) {
      // 隐藏框
      let name = type === 'year' ? 'inputVisibleYear' : 'inputVisibleClass';
      this[name][item] = false;
      this[name] = Object.assign({}, this[name]);
      if (type === 'year') {
        this.addMenu(type, { specialty: item, year: this.year_value }, { specialty: item, year: this.year_value , class: 'B' });
      } 
      if (type === 'class') {
        let tmp = item.split('_');
        // console.log(this.class_value);
        this.addMenu(type, 
        { specialty: tmp[1], year: tmp[0], class: this.class_value.toUpperCase() },
        { specialty: tmp[1], year: tmp[0], class: this.class_value.toUpperCase() }
        );
      }
    },
    // 失去焦点 / 隐藏输入框
    hideInput(item, type) {
       // 隐藏框
      let name = type === 'year' ? 'inputVisibleYear' : 'inputVisibleClass';
			this[name][item] = false;
      this[name] = Object.assign({}, this[name]);
    },
    // 添加专业
    async addSpecialty() {
      let param = {
        specialty: this.specialty_value,
        year: new Date().getFullYear(),
        class: 'A'
      }
      this.addMenu('specialty', { specialty: this.specialty_value }, param);
    },
    async add(params) {
      let { data } = await this.$http.post('/menu/add', {
        token: this.myUser.token,
        ...params
      });
      const { status, message } = data;
      var type = status === 0 ? 'success' : 'error' ;
      this.$message({ type, message });
      if (status === 0) this.getMenu();
    },
    // 添加操作
    async addMenu(type, repeatParams, addParams) {
      const valName = type + "_value";
      // 是否为空
       if (this[valName].trim() === '') return this.$message({
        type: 'warning',
        message: type + "不能为空"
      });
      // 是否存在
      let isRepat = await this.repeat(repeatParams);
      if (isRepat) {
        this[valName] = '';
        return this.$message({ type: 'warning', message: this[valName] + "已经存在" });
      }
      // 添加参数
       this.add(addParams);
       this[valName] = '';
   },
    async repeat(param) {
      let vals = Object.values(param);
      let params = Object.keys(param).map((item, index) => `${item}=${vals[index]}`);
      let { data } = await this.$http.get(`/menu?${params.join("&")}`);
      if (data.data.length > 0) return true;
      return false;
    },
    async getExamType() {
      const { data } = await this.$http.get("/exam_type");
      this.exam_type = data.data;
    },
    // 添加考试类型
    async addExamType() {
       let { data } = await this.$http.post('/exam_type/add', {
        token: this.myUser.token,
        exam_type: this.exam_type_value
      });
      const { status, message } = data;
      var type = status === 0 ? 'success' : 'error' ;
      this.$message({ type, message });
      this.exam_type_value = '';
      this.getExamType();
    },
    // 删除级别
    // 删除考试类型
    async handleDelExamType(params) {
      let { data } = await this.$http.post('/exam_type/remove', {
        token: this.myUser.token,
        ...params
      });
      this.showTips(data);
      if (data.status === 0) this.getExamType();
    },
    showTips(data) {
      const { status, message } = data;
      var type = status === 0 ? 'success' : 'error' ;
      this.$message({ type, message });
    }
  },
};
</script>

<style lang="scss" scoped>
$v_l: 140px; 
// 左边距
.left {
  margin-left: $v_l;
}
// 左边距小
.left_small {
  margin-left: 20px;
}
// 左边最长的线
.left_line {
  border-left: 1px solid #ccc;
  padding-left: 5px;
}
// 竖线
.vertical_line::after {
  border-left: 1px solid #ccc;
}
// 横线
.horizontal_line::after {
  content: '';
  position: absolute;
  top: -24px;
  left: -145px;
  width: $v_l;
  height: 41px;
  border-bottom: 1px solid #ccc;
}
.top {
  margin-top: 10px;
  position: relative;
}
.my_class_box {
  display: flex;
  justify-content: flex-start;
}
</style>