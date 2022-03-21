<template>
  <div class="my_page_pd">
    <Tab className="my_container" title="学生账号管理" />
    <div class="my_container">
        <div class="my_flex">
          <Search placeholder="输入学号或姓名搜索" :searchTo="searchTo" />
          <div>
            <el-button :disabled="myUser.grade > 1" type="primary" plain @click="$router.push('/importExecl?name=student_account')">从execl批量创建添加账号</el-button>
            <el-button :disabled="myUser.grade > 1" @click="toStudentAccountEdit('add')" type="primary">添加学生账号</el-button>
          </div>
        </div>
        <el-table  
          class="my_top"
          :data="student_accounts"
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
              width="120"
              >
            </el-table-column>
            <el-table-column
              prop="password"
              label="密码"
              width="110"
              >
            </el-table-column>
            <el-table-column
              prop="id"
              label="身份证"
              width="210"
              >
            </el-table-column>
            <el-table-column
              prop="specialty"
              label="专业"
              width="150"
              >
            </el-table-column>
            <el-table-column
              prop="year"
              label="年级"
              width="60"
              >
            </el-table-column>
            <el-table-column
              prop="class"
              label="班级"
              width="50"
              >
            </el-table-column>
            <el-table-column
            label="操作"
            >
          <template slot-scope="scope">
            <el-button 
            @click="toStudentAccountEdit('edit', scope.row)" 
            size="mini" type="primary" 
            :disabled="myUser.grade > 1">编辑</el-button>
            <el-button 
            @click="toStudentAccountEdit('reset', { student_no: scope.row.student_no })" 
            size="mini" type="info" 
            :disabled="myUser.grade > 1">重置密码</el-button>
            <el-button 
            @click="toStudentAccountEdit('remove', { student_no: scope.row.student_no })" 
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
    <!-- 提示框 -->
    <!-- 添加/编辑账号 -->
    <el-dialog :title="title" width="450px" :visible.sync="showUserDialogFormVisible">
      <el-form :model="student_account" :rules="rules" ref="student_account">
        <el-form-item label="姓名" prop="name" :label-width="labelWidth">
          <el-input placeholder="学生的姓名" style="width: 300px;" v-model="student_account.name"></el-input>
        </el-form-item>
        <el-form-item label="账号/学号" prop="student_no" :label-width="labelWidth">
          <el-input placeholder="账号就是学号" style="width: 300px;" v-model="student_account.student_no" :disabled="this.type === 'edit'"></el-input>
        </el-form-item>
        <el-form-item label="密码" :label-width="labelWidth">
          <el-input placeholder="默认为123456" style="width: 300px;" v-model="student_account.password"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="hideAddUserDialogFormVisible">取 消</el-button>
        <el-button type="primary" @click="operateStudentAccount">确 定</el-button>
      </div>
      </el-dialog>
      <!-- 删除账号 -->
      <el-dialog
        :title="selectTitle[type]"
        :visible.sync="resetOrDelDialogVisible"
        width="30%"
        >
        <span>确定要{{selectTitle[type]}}？（不可恢复）</span>
        <span slot="footer" class="dialog-footer">
          <el-button @click="resetOrDelDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="operateStudentAccount">确 定</el-button>
        </span>
      </el-dialog>
  </div>
</template>

<script>
import Tab from '../../Tab.vue';
import Search from '../../Search.vue';
import { getToken } from '../../../util';
export default {
  components: {
    Tab,
    Search
  },
  data() {
    return {
      labelWidth: "90px",
      student_accounts: [],
      startIndex: 0,
      endIndex: 10,
      pageSize: 10,
      currentPage: 1,
      keywords: '',
      total: 0,
      myUser: getToken(),
      student_account: { password: '123456' },
      title: '添加学生账号',
      selectTitle: {
        add: '添加学生账号',
        edit: '编辑学生账号',
        reset: '重置账号密码',
        remove: '删除学生账号'
      },
      type: 'add', // 标识符 add / edit / reset / remove
      showUserDialogFormVisible: false,
      rules: {
        name: [
          { required: true, message: '请输入姓名', trigger: 'blur' }
        ],
        student_no: [
          { required: true, message: '请输入学号', trigger: 'blur' },
          { min: 10, max: 20, message: '学号不小于十位', trigger: 'blur' }
        ],
      },
      resetOrDelDialogVisible: false
    }
  },
  mounted() {
    this.getStudentAccount();
  },
  methods: {
    async getStudentAccount() {
      const { data } = await this.$http.get(`/student_account?startIndex=${this.startIndex}&endIndex=${this.endIndex}&keywords=${this.keywords}&token=${getToken().token}`);
      this.student_accounts = data.data;
      this.total = data.total;
    },
    searchTo(keywords) {
      this.startIndex = 0;
      this.endIndex = this.pageSize;
      this.keywords = keywords;
      this.getStudentAccount();
    },
    handleCurrentChange(e) {
      scrollTo(0, 0);
      this.startIndex = this.pageSize * (e - 1);
      this.endIndex = e * this.pageSize <= this.total ? e * this.pageSize : this.total;
      this.getStudentAccount();
    },
    hideAddUserDialogFormVisible() {
      this.showUserDialogFormVisible = false;
      this.student_account = { password: "123456" };
      this.getStudentAccount();
    },
    async operateStudentAccount() {
      if ((!this.student_account.name || !this.student_account.student_no ||
      this.student_account.student_no.length < 10) && (this.type !== 'reset' && this.type !== 'remove')) return;

      const { data } = await this.$http.post(`/student_account/${this.type}`, {
        token: this.myUser.token,
        ...this.student_account
      });
      this.$message({
        type: data.status !== -1 ? 'success' : 'error',
        message: data.message
      });

      this.showUserDialogFormVisible = false;
      this.resetOrDelDialogVisible = false;
      this.student_account = { password: "123456" };
      this.getStudentAccount();
    },
    toStudentAccountEdit(type, student_account = { password: "123456" }) {
      if (type !== 'reset' && type !== 'remove') {
        this.showUserDialogFormVisible = true;
        this.title = this.selectTitle[type];
      }
      this.type = type;
      this.student_account = student_account;
      if (type === 'reset' || type === 'remove') {
        this.resetOrDelDialogVisible = true;
      }
    }
  }
}
</script>