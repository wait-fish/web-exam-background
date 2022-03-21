<template>
  <div class="my_page_pd">
    <Tab className="my_container" title="学生信息管理" :title2="type" />
    <div class="my_container">
        <el-form :model="score" :rules="rules" ref="ruleForm" label-width="100px" >
          <el-form-item label="学生姓名" prop="name">
            <el-input style="width: 200px;" v-model="score.name"></el-input>
          </el-form-item>
          <el-form-item label="学号" prop="student_no">
            <el-input style="width: 150px;" v-model="score.student_no"></el-input>
          </el-form-item>
          <el-form-item label="专业年级班级">
            <el-cascader
              v-model="class_info"
              :options="class_options"
            ></el-cascader>
          </el-form-item>
          <el-form-item label="考试类型等级">
            <el-cascader
              v-model="exam_info"
              :options="exam_options"
            ></el-cascader>
          </el-form-item>
          <el-form-item label="理论成绩" prop="theory">
            <el-input style="width: 60px;" v-model="score.theory"></el-input>
          </el-form-item>
          <el-form-item label="实操成绩" prop="practice">
            <el-input style="width: 60px;" v-model="score.practice"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="addScore">确定</el-button>
            <el-button @click="$router.replace('/score')">取消</el-button>
          </el-form-item>
        </el-form>
    </div>
  </div>
</template>

<script>
import { getToken } from '../../../util'
import Tab from '../../Tab.vue'
import { findValues, findIndexs } from "../../../util/find.js"

export default {
  data() {
    return {
      type: '',
      score: {
        name: '',
        student_no: '',
      },
      ruleForm: {
        name: '',
        student_no: '',
      },
      rules: {
        name: [
          { required: true, message: '请输入姓名', trigger: 'blur' }
        ],
        student_no: [
          { required: true, message: '请输入学号', trigger: 'blur' },
          { min: 10, max: 10, message: '学号为十位数', trigger: 'blur' }
        ],
        theory: [
          { required: true, message: '理论', trigger: 'blur' },
          {
            validator(rule, value, callback) {
            if (Number(value) >= 0 && Number(value) <= 100) {
              callback()            
              } else {
                callback(new Error('分数为0-100'))
              }
            }
          }
        ],
        practice: [
          { required: true, message: '理论', trigger: 'blur' },
          {
            validator(rule, value, callback) {
            if (Number(value) >= 0 && Number(value) <= 100) {
              callback()            
              } else {
                callback(new Error('分数为0-100'))
              }
            }
          }
        ],
      },
      class_options: [],
      class_info: [], // 专业信息
      exam_options: [],
      exam_info: [],
    }
  },
  components: {
    Tab
  },
  mounted() {
   this.getData();
  },
  methods: {
    async getData() {
      let { type, s_id } = this.$route.query;
      this.type = type === 'add' ? '录入成绩' : '编辑成绩' ;
      await this.getMenu();
      await this.getExamInfo();
      if (type === 'edit') this.getScore(s_id);
    },
    async getScore(s_id) {
      let { data } = await this.$http.post('/score',{ token: getToken().token, s_id });
      this.score = data.data[0];
      let { specialty, year, exam_type, exam_level } = this.score; 
			this.class_info = findIndexs(this.class_options, [specialty, year, this.score.class ])
      this.exam_info = findIndexs(this.exam_options, [ exam_type, exam_level ])
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
    async addScore() { // 编号转字符
			const [specialty, year, className] = findValues(this.class_options, this.class_info)
			const [exam_type, exam_level] = findValues(this.exam_options, this.exam_info)
      this.score.specialty = specialty;
      this.score.year = year;
      this.score.class = className;
      this.score.exam_type = exam_type;
      this.score.exam_level = exam_level;
      if (this.scoreIsEmptys()) return this.notNull();
      if ((Number(this.score.theory) < 0 || Number(this.score.theory) > 100)  || 
      (Number(this.score.practice) < 0 || Number(this.score.practice) > 100))
      return this.notNull('分数必须是0-100之间')

      let { data } = await this.$http.post(`/score/${this.$route.query.type}`, {
        token: getToken().token,
        ...this.score
      });
      let { status, message } = data;
      this.$message({
        type: status === 0 ? 'success' : 'error',
        message  
      }); 
      setTimeout(() => {
        this.$router.replace('/score');
      }, 1000);
    },
    notNull(text = '不能有值为空') {
      this.$message({
        type: 'warning',
        message: text
      });
    },
    scoreIsEmptys() {
      let keys = Object.keys(this.score);
      let i = keys.indexOf('registration_time');
      keys.splice(i, i);
      // keys.forEach(item => {
      //   console.log(item);
      // });
      return keys.some(item => this.score[item] === '' || this.score[item] == undefined );
    }
  }
}
</script>

<style lang="scss">
</style>