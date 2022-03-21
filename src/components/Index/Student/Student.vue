<template>
  <!-- 返回顶部标识 -->
  <div class="my_page_pd"> 
    <Tab title="学生信息管理" className="my_container" />
    <div class="my_container">
        <div class="my_flex">
          <div class="my_flex">
             <el-select style="width: 90px;margin-right: 5px" v-model="key">
              <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>
          <Search :searchTo="searchTo" placeholder="输入某条信息进行搜索" />
          </div>
           <div >
             <!-- 导出学生信息 -->
             <el-button @click="saveImgs" type="success">导出证件照</el-button>
            <SaveExecl 
            :tableNames="tableNames" 
            :outData="students"
            execlName="导出学生信息"
            :filterColNames="filterColNames" />
            <el-button :disabled="myUser.grade > 1" @click="toExeclPage" type="primary" plain>从excel导入</el-button>
            <el-button :disabled="myUser.grade > 1" @click="toStudentEdit('add')" type="primary" >添加报名信息</el-button>
          </div>
        </div>
        <el-table  
          class="my_top"
          :data="students"
          stripe
          style="width: 100%"
          :border=true>
            <el-table-column
              prop="name"
              label="姓名"
              width="80"
              >
            </el-table-column>
            <el-table-column
              prop="student_no"
              label="学号"
              width="105"
              >
            </el-table-column>
            <el-table-column
              prop="img_src"
              label="头像"
              width="105"
              >
              <template slot-scope="scope">
                <img width="80" height="106" :src="BASE_URL + scope.row.img_src" alt="暂无头像">
              </template>
            </el-table-column>
            <el-table-column
              prop="id"
              label="身份证"
              width="180"
              >
            </el-table-column>
            <el-table-column
              prop="specialty"
              label="专业"
              width="120"
              >
            </el-table-column>
            <el-table-column
              prop="year"
              label="年级"
              width="55 "
              >
            </el-table-column>
            <el-table-column
              prop="class"
              label="班级"
              width="35"
              >
            </el-table-column>
            <el-table-column
              prop="exam_type"
              label="考试类型"
              width="120"
              >
            </el-table-column>
            <el-table-column
              prop="exam_level"
              label="考试等级"
              width="50"
              >
            </el-table-column>
            <el-table-column
              prop="status"
              label="状态"
              width="80"
              >
              <template slot-scope="scope">
								<el-tag :type="status[scope.row.status].type">{{status[scope.row.status].value}}</el-tag>
              </template>
            </el-table-column>
            <el-table-column
            label="操作"
            >
          <template slot-scope="scope">
            <el-button 
            @click="toStudentEdit('edit', scope.row.s_id)" 
            size="mini" type="primary" 
            :disabled="myUser.grade > 1">编辑</el-button>
            <el-button 
            @click="showDelDialog(scope.row.s_id)" 
            v-if="scope.row.useraccount!=='admin'" 
            size="mini" type="danger" 
            :disabled="myUser.grade > 1">删除</el-button>
          </template>
          </el-table-column>
        </el-table>
        <!-- 分页器 -->
        <el-pagination class="my_top"
          @current-change="handleCurrentChange"
          :current-page="currentPage"
          :page-size="pageSize"
          layout="total, prev, pager, next, jumper"
          :total="total"
        >
        </el-pagination>
    </div>
    <!-- 对话框 -->
    <el-dialog
      title="删除学生信息"
      :visible.sync="delDialogVisible"
      width="30%">
      <span>是否删除？</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="delDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="delStudent">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import Tab from '../../Tab.vue';
import Search from '../../Search.vue';
import SaveExecl from '../../SaveExecl.vue';
import { getToken, BASE_URL } from '../../../util';
import downloadFiles from "../../../util/downloadFiles";

export default {
  data() {
    return {
      BASE_URL: BASE_URL + '/',
      myUser: {},
      students: [],
      status: {
				0: {
					type: 'success',
					value: '通过'
				},
				1: {
					type: 'danger',
					value: '未通过'
				},
				2:{
					type: 'warning',
					value: '待审核'
				}
			},
      options: [
        {
          value: 'name',
          label: '姓名'
        },
        {
          value: 'student_no',
          label: '学号'
        },
        {
          value: 'specialty',
          label: '专业'
        },
        {
          value: 'year',
          label: '年级'
        },
        {
          value: 'exam_type',
          label: '考试类型'
        },
        {
          value: 'exam_level',
          label: '考试等级'
        },
      ],
      key: 'name',
      currentPage: 1,
      pageSize: 10,
      startIndex: 0,
      endIndex: 10,
      total: 0,
      delDialogVisible: false,
      s_id: '',
      tableNames: ['姓名', '学号', '身份证', '专业', '年级', '班级', '考试类型', '考试等级'],
      filterColNames: ['img_src', 'status', 'registration_time', 's_id']
    }
  },
  components: {
    Tab,
    Search,
    SaveExecl
  },
  mounted() {
    this.myUser = getToken();
    this.getStudents({ startIndex: this.startIndex, endIndex: this.endIndex });
  },
  methods: {
    toExeclPage() {
      this.$router.push("/importExecl?name=student");
    },
    async getStudents(params) {
      const { data } = await this.$http.post("/student",{
        token: this.myUser.token,
        ...params
      });
      // console.log(data);
      this.students = data.data;
      this.total = data.total;
    },
    searchTo(e) {
      // console.log(e);
      // console.log(this.key);
      this.startIndex = 0;
      this.endIndex = 10;
      let params = {startIndex: this.startIndex, endIndex: this.endIndex};
      if (e !== '')params[this.key] = e;
      this.getStudents(params);
    },
    handleCurrentChange(e) {
      scrollTo(0, 0);
      this.startIndex = this.pageSize * (e - 1);
      this.endIndex = e * this.pageSize <= this.total ? e * this.pageSize : this.total - 1 ;
      this.getStudents({ startIndex: this.startIndex, endIndex: this.endIndex });
    },
    toStudentEdit(type, id) {
      this.$router.push(`/student_edit?type=${type}&s_id=${id}`);
    },
    showDelDialog(s_id) {
      this.s_id = s_id;
      this.delDialogVisible = true
    },
    async delStudent() {
      let { data } = await this.$http.post("/student/remove", { 
        token: getToken().token, 
        s_id: this.s_id 
      });
      let { status, message } = data;
      this.delDialogVisible = false;
      this.$message({
        type: status === 0 ? 'success' : 'error',
        message 
      });
      this.getStudents({ startIndex: this.startIndex, endIndex: this.endIndex });
    },
    // 保存头像的回调
    saveImgs() {
      let imgs = [];
      this.students.forEach(item => {
        if (!item.img_src.trim()) return;
        imgs.push({
          fileUrl: this.BASE_URL + item.img_src,
          renameFileName: item.student_no + '-' + item.name + '.png'
        });
      });
      // console.log(imgs);
      let name = new Date().toLocaleDateString().replace('/', '-').replace('/', '-');
      downloadFiles(imgs, name + '证件照');
    }
  }
}
</script>