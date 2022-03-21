<template>
  <div class="my_page_pd">
    <Tab title="账号权限管理" className="my_container" />
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
          <Search placeholder="输入账号/备注进行搜索" :searchTo="searchTo" />
          </div>
          <div>
            <el-button type="primary" 
            @click="UserDialogFormVisible('add')" 
            :disabled="myUser.useraccount !== 'admin'">添加账号</el-button>
          </div>
        </div>
        <!-- 表格 -->
        <el-table
          class="my_top"
          :data="users"
          stripe
          style="width: 100%"
          :border=true
          >
          <el-table-column
            prop="useraccount"
            label="账号"
            width="200"
            >
          </el-table-column>
          <el-table-column
            prop="grade"
            label="权限"
            width="160"
            >
            <template slot-scope="scope">
              {{gradeNames[scope.row.grade]}}
            </template>
          </el-table-column>
          <el-table-column
            prop="remark"
            label="备注"
            min-width="250"
            >
          </el-table-column>
          <el-table-column
            label="操作"
            width="200">
          <template slot-scope="scope">
            <!-- 
              {{!(myUser.useraccount === scope.row.useraccount && myUser.grade <= 1 || myUser.useraccount === 'admin')}} 
              让整个结果出现相反的结果
            -->
            <el-button 
            @click="UserDialogFormVisible('edit', scope.row)" 
            size="mini" type="primary" 
            :disabled="!(myUser.useraccount === scope.row.useraccount && myUser.grade <= 1 || myUser.useraccount === 'admin')">编辑</el-button>
            <el-button 
            @click="showDelDialog(scope.row.useraccount)" 
            v-if="scope.row.useraccount!=='admin'" 
            size="mini" type="danger" 
            :disabled="myUser.useraccount !== 'admin'">删除</el-button>
          </template>
          </el-table-column>
        </el-table>
    </div>
    <!-- 提示框 -->
    <!-- 添加/编辑账号 -->
    <el-dialog :title="title" width="450px" :visible.sync="showUserDialogFormVisible">
    <el-form :model="user" >
      <el-form-item label="账号" :label-width="labelWidth">
        <el-input placeholder="6-16位为数字或字母组成" style="width: 300px;" v-model="user.useraccount" :disabled="this.type === 'edit'"></el-input>
      </el-form-item>
      <el-form-item label="密码" :label-width="labelWidth">
        <el-input placeholder="6-16位为数字或字母组成" style="width: 300px;" v-model="user.password"></el-input>
      </el-form-item>
      <el-form-item label="权限" :label-width="labelWidth">
        <el-select v-model="user.grade" style="width: 150px;" :disabled="myUser.useraccount !== 'admin' || myUser.grade !== 0" placeholder="请选择权限级别">
          <el-option 
          v-for="(item, index) in gradeNames" 
          :label="item" 
          :value="index"
          :key="item"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="备注" :label-width="labelWidth" >
        <el-input style="width: 300px;" v-model="user.remark"></el-input>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="hideAddUserDialogFormVisible">取 消</el-button>
      <el-button type="primary" @click="operateUser">确 定</el-button>
    </div>
    </el-dialog>
    <!-- 删除对话框 -->
    <el-dialog
      title="删除账号"
      :visible.sync="delDialogVisible"
      width="30%">
      <span>是否删除？</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="delDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="delUser">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import Tab from '../Tab.vue';
import Search from '../Search.vue';
import { getToken, gradeNames } from '../../util';

const Exp = /^[0-9a-zA-Z]{6,16}$/;
export default {
  data() {
    return {
      myUser: {},
      users: [],
      gradeNames,
      options: [
        {
          value: 'useraccount',
          label: '账号'
        }, 
        {
          value: 'remark',
          label: '备注'
        }],
      key: "useraccount",
      showUserDialogFormVisible: false, // 编辑/天玑提示框
      user: { 
        useraccount: '',
        password: '',
        grade: 1,
        remark: ''
      },
      labelWidth: '80',
      type: '',
      title: "",
      delUseraccount: '',
      delDialogVisible: false // 删除提示框
    }
  },
  components: {
    Tab,
    Search
  },
  mounted() {
    this.getUsers();
    this.myUser = getToken();
  },
  methods: {
    async getUsers() {
      let { data } = await this.$http.get("/user");
      this.users = data.data || [];
    },
    async searchTo (value) {
      let keyword = '';
      if (value.trim() !== '') {
        keyword = value ? `?${this.key}=${value}` : '' ;
      }
      let { data } = await this.$http.get("/user" + keyword);
      this.users = data.data;
    },
    // 隐藏框
    hideAddUserDialogFormVisible() {
      this.showUserDialogFormVisible = false;
      this.user = {};
    },
    // 操作用户
    async operateUser() {
      let { useraccount, password, ...rest } = this.user;
      password = password || '';
      if (useraccount.trim() == '' || (this.type !== 'edit' && password.trim() == '')) return this.$message({
      message: "账号/密码不能为空", type: "warning"
      });
      if (!Exp.test(useraccount.trim()) || (password.trim() !== '' && !Exp.test(password.trim()))) return this.$message({
        message: "账号/密码为6-16位且由数字或字母组成", type: "warning"
      })
      let { data } = await this.$http.get("/user?useraccount=" + useraccount);
      if (data.data.length !== 0 && this.type !== 'edit') return this.$message({
        message: "账号已经存在", type: "error"
      });
      let row;
      if (this.type === 'add') {
        let { data } = await this.$http.post("/user/register", {
          useraccount,
          password,
          ...rest
        });
        row = data;
      }
      if (this.type === 'edit') {
        let { data } = await this.$http.post("/user/edit", {
          useraccount,
          password,
          ...rest,
          token: getToken().token
        });
        row = data;
      }
      let type = row.status === 0 ? "success" : 'error';
      this.$message({ message: row.message, type });
      this.hideAddUserDialogFormVisible();
      this.getUsers();
    },
    UserDialogFormVisible(type, user) {
      this.type = type;
      this.user = user || this.user;
      this.showUserDialogFormVisible = true;
      this.title = type === 'add'? '添加账号' : '修改账号信息' ;
    },
    showDelDialog(useraccount) {
      this.delUseraccount = useraccount;
      this.delDialogVisible = true;
    },
    async delUser() {
      let { data: row } = await this.$http.post("/user/remove", {
          useraccount: this.delUseraccount,
          token: getToken().token
        });
      let type = row.status === 0 ? "success" : 'error';
      this.$message({ message: row.message, type });
      this.getUsers();
      this.delDialogVisible = false;
    }
  }
}
</script>