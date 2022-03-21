<template>
  <div class="my_page_pd">
    <Tab className="my_container" title="学生信息管理" :title2="type" />
    <div class="my_container">
			<Search style="margin-left: 100px;" :searchTo="searchTo" placeholder="输入学号搜索匹配报名信息" width="250" /><br/><br/><br/>
				<el-form :model="student" :rules="rules" ref="ruleForm" label-width="100px" >
          <el-form-item label="学生姓名" prop="name">
            <el-input style="width: 200px;" v-model="student.name"></el-input>
          </el-form-item>
          <el-form-item label="学号" prop="student_no">
            <el-input style="width: 150px;" v-model="student.student_no"></el-input>
          </el-form-item>
          <el-form-item label="证件照">
            <el-upload
              action=""
              list-type="picture-card"
              :on-preview="handlePictureCardPreview"
              :on-exceed="changeFile"
              :on-change="changeFile"
              :multiple=false
              :limit=1
              :file-list="fileList"
              :auto-upload="false"
              >
              <i class="el-icon-plus"></i>
            </el-upload>
            <el-dialog :visible.sync="imgDialogVisible">
              <img width="100%" :src="imgDialogImageUrl" alt="">
            </el-dialog>
          </el-form-item>
          <el-form-item label="身份证" prop="id">
            <el-input style="width: 200px;" v-model="student.id"></el-input>
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
          <el-form-item label="当前状态">
            <el-select style="width: 100px;" v-model="student.status" placeholder="请选择">
             <el-option
              v-for="item in status_options"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="addStudent">确定</el-button>
            <el-button @click="$router.replace('/student')">取消</el-button>
          </el-form-item>
        </el-form>
    </div>
  </div>
</template>

<script>
import { BASE_URL, getToken } from '../../../util'
import Tab from '../../Tab.vue'
import Search from '../../Search.vue'
import {  findIndexs, findValues } from '../../../util/find.js'

export default {
  data() {
    return {
      type: '',
      student: {
        name: '',
        student_no: '',
        img_src: '',
        id: '',
        status: 0
      },
      ruleForm: {
        name: '',
        student_no: '',
        img_src: '',
        id: '',
        status: '通过'
      },
      rules: {
        name: [
          { required: true, message: '请输入姓名', trigger: 'blur' }
        ],
        student_no: [
          { required: true, message: '请输入学号', trigger: 'blur' },
          { min: 10, max: 10, message: '学号为十位数', trigger: 'blur' }
        ],
        id: [
          { required: true, message: '请输入身份证', trigger: 'blur' },
          { min: 18, max: 18, message: '身份证为19位', trigger: 'blur' }
        ]
      },
      imgDialogImageUrl: '',
      imgDialogVisible: false,
      fileList: [],
      uploadfile: {},
      class_options: [],
      class_info: [], // 专业信息
      exam_options: [],
      exam_info: [],
      status_options: [
        {
          value: 0,
          label: '通过'
        },
        {
          value: 1,
          label: '未通过'
        },
        {
          value: 2,
          label: '待审核'
        }
      ]
    }
  },
  components: {
    Tab,
		Search
  },
  mounted() {
   this.getData();
	 // console.log(this.$route);
  },
  methods: {
    async getData() {
      let { type, s_id } = this.$route.query;
      this.type = type === 'add' ? '添加学生' : '编辑学生' ;
      await this.getMenu();
      await this.getExamInfo();
      if (type === 'edit') this.getStudent(s_id);
    },
    async getStudent(s_id) {
      let { data } = await this.$http.post('/student',{ token: getToken().token, s_id });
      this.student = data.data[0];
      this.fileList = [{
          name: new Date().getTime(),
          url: BASE_URL + '/' + this.student.img_src
        }]
      let { specialty, year, exam_type, exam_level } = this.student;
			
			this.class_info = findIndexs(this.class_options, [specialty, year, this.student.class ])
      this.exam_info = findIndexs(this.exam_options, [ exam_type, exam_level ])
		},
     // 预览图片
    handlePictureCardPreview (file) {
      this.imgDialogImageUrl = file.url
      this.imgDialogVisible = true
    },
    // 更换图片时图片
    changeFile (file) {
      if (file.url !== undefined) {
        this.uploadfile = file.raw
        this.fileList = [{
          name: file.name,
          url: file.url
        }]
      } else {
        this.uploadfile = file[0]
        this.fileList = [{
          name: file[0].name,
          url: window.URL.createObjectURL(file[0])
        }]
      }
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
    async addStudent() {
      const [specialty, year, className] = findValues(this.class_options, this.class_info)
      const [exam_type, exam_level] = findValues(this.exam_options, this.exam_info)
      this.student.specialty = specialty;
      this.student.year = year;
      this.student.class = className;
      this.student.exam_type = exam_type;
      this.student.exam_level = exam_level;
      if (this.studentIsEmptys()) return this.notNull();
      if (this.uploadfile.name) await this.upload();
      let { data } = await this.$http.post(`/student/${this.$route.query.type}`, {
        token: getToken().token,
        ...this.student
      });
			if (this.$route.query.type === 'edit' && this.student.status !== 2) await this.$http.post(`/news/add`, { student_no: this.student.student_no, status:  this.student.status})
      let { status, message } = data;
      this.$message({
        type: status === 0 ? 'success' : 'error',
        message  
      }); 
      setTimeout(() => {
        this.$router.replace('/student');
      }, 1000);
    },
    async upload () {
      let fd = new FormData();
      fd.append('file', this.uploadfile); 
      const { data } = await this.$http.post('/upload', fd);
      this.student.img_src = data.url
    },
    notNull(text = '') {
      this.$message({
        type: 'warning',
        message: text + '不能有值为空'
      });
    },
    studentIsEmptys() {
      let keys = Object.keys(this.student);
      let i = keys.indexOf('img_src');
      keys.splice(i, i);
      let i1 = keys.indexOf('registration_time');
      keys.splice(i1, i1);
      // keys.forEach(item => {
      //   console.log(item);
      // });
      return keys.some(item => this.student[item] === '' || this.student[item] == undefined );
    },
		async searchTo(student_no) {
			if (student_no.trim() === '') {
				this.student = { status: 2 }
				this.class_info = []
				return
			} 
			const { data } = await this.$http.get(`/student_account?keywords=${student_no}&token=${getToken().token}`); 
			let student = data.data[0]
			this.class_info = findIndexs(this.class_options, [student.specialty, student.year, student.class ])
			delete student.password
			delete student.year
			delete student.specialty
			delete student.class
			this.student = student
			this.student.status = 2
		}
  }
}
</script>
