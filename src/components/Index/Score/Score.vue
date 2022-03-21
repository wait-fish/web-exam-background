<template>
  <div class="my_page_pd">
    <Tab className="my_container" title="成绩管理" />
    <div class="my_container">
      <!-- 头部 -->
      <div class="my_flex">
        <div class="my_flex">
          <el-select style="width: 120px;margin-right: 5px" v-model="key">
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
          <SaveExecl 
            :tableNames="tableNames" 
            :outData="scores"
            execlName="导出成绩"
            :filterColNames="filterColNames" />
          <el-button :disabled="myUser.grade > 1" @click="toExeclPage" type="primary" plain>从excel导入</el-button>
          <el-button :disabled="myUser.grade > 1" @click="toScoreEdit('add')" type="primary" >录入学生成绩</el-button>
        </div>
      </div>
      <!-- 列表 -->
      <el-table  
          class="my_top"
          :data="scores"
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
              width="80"
              >
            </el-table-column>
            <el-table-column
              prop="passed"
              label="是否通过"
              width="100"
              >
              <template slot-scope="scope">
              <el-tag type="success" v-if="(scope.row.theory >= 60 && scope.row.practice >= 60)">通过</el-tag>
              <el-tag type="danger" v-else>未通过</el-tag>
            </template>
            </el-table-column>
            <el-table-column
              prop="theory"
              label="理论成绩"
              width="80"
              >
            </el-table-column>
            <el-table-column
              prop="practice"
              label="实操成绩"
              width="80"
              >
            </el-table-column>
            <el-table-column
            label="操作"
            >
          <template slot-scope="scope">
            <el-button 
            @click="toScoreEdit('edit', scope.row.s_id)" 
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
        <!-- 对话框 -->
        <el-dialog
          title="删除成绩信息"
          :visible.sync="delDialogVisible"
          width="30%">
          <span>是否删除？</span>
          <span slot="footer" class="dialog-footer">
            <el-button @click="delDialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="delScore">确 定</el-button>
          </span>
        </el-dialog>
    </div>
  </div>
</template>

<script>
import { getToken } from '../../../util';
import Tab from '../../Tab.vue';
import Search from '../../Search.vue';
import SaveExecl from '../../SaveExecl.vue';

export default {
  data() {
    return {
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
        }
      ],
      key: 'exam_type',
      myUser: {},
      currentPage: 1,
      pageSize: 10,
      startIndex: 0,
      endIndex: 10,
      total: 0,
      scores: [],
      delDialogVisible: false,
      s_id: '',
      tableNames: ['学号', '姓名', '专业', '年级', '班级', '考试类型', '考试等级', '理论成绩', '实操成绩'],
      filterColNames: ['s_id', 'registration_time']
    }
  },
  components: {
    Tab,
    Search,
    SaveExecl
  },
  mounted() {
    this.myUser = getToken();
    this.getScores({ startIndex: this.startIndex, endIndex: this.endIndex });
  },
  methods: {
    searchTo(e) {
      this.startIndex = 0;
      this.endIndex = 10;
      let params = {startIndex: this.startIndex, endIndex: this.endIndex};
      if (e !== '')params[this.key] = e;
      this.getScores(params);
    },
    toExeclPage() {
      this.$router.push("/importExecl?name=score");
    },
    toScoreEdit(type, id) {
      this.$router.push(`/score_edit?type=${type}&s_id=${id}`);
    },
    async getScores(params) {
      const { data } = await this.$http.post("/score",{
        token: this.myUser.token,
        ...params
      });
      // console.log(data);
      this.scores = data.data;
      this.total = data.total;
    },
    handleCurrentChange(e) {
      scrollTo(0, 0);
      this.startIndex = this.pageSize * (e - 1);
      this.endIndex = e * this.pageSize <= this.total ? e * this.pageSize : this.total - 1 ;
      this.getScores({ startIndex: this.startIndex, endIndex: this.endIndex });
    },
    showDelDialog(s_id) {
      this.delDialogVisible = true;
      this.s_id = s_id;
    },
    async delScore() {
      let { data } = await this.$http.post("/score/remove", { 
        token: getToken().token, 
        s_id: this.s_id 
      });
      let { status, message } = data;
      this.delDialogVisible = false;
      this.$message({
        type: status === 0 ? 'success' : 'error',
        message 
      });
      this.getScores({ startIndex: this.startIndex, endIndex: this.endIndex });
    }
  }
}
</script>

<style lang="scss" scoped>

</style>