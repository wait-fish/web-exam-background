<template>
  <div class="my_page_pd">
    <Tab title="财务管理" className="my_container" />
    <div class="my_container">
      <div class="my_flex">
        <Search placeholder="输入年份进行搜索（2022）" :searchTo="searchTo" />
        <div>
          <el-button @click="toEditFund('add')" :disabled="myUser.grade !== 0" type="primary">添加单据</el-button>
        </div>
      </div>
      <!-- 表格 -->
      <el-table
        class="my_top"
        :data="funds"
        stripe
        style="width: 100%"
        :border=true
        >
        <el-table-column
          label="日期区间"
          >
          <template slot-scope="scope">
            <el-tag >{{scope.row.order_id.split('|')[0]}}</el-tag> 至 
            <el-tag >{{scope.row.order_id.split('|')[1]}}</el-tag>
          </template>
        </el-table-column>
        <el-table-column
          prop="students"
          label="报名人数"
          width="90"
          >
        </el-table-column>
        <el-table-column
          prop="registration_fee_total"
          label="报名总金额（元）"
          width="133"
          >
          <template slot-scope="scope">
            {{scope.row.registration_fee_total}}元
          </template>
        </el-table-column>
        <el-table-column
          prop="exam_fee_total"
          label="考务费总金额（元）"
          width="147"
          >
           <template slot-scope="scope">
            {{scope.row.exam_fee_total}}元
          </template>
        </el-table-column>
        <el-table-column
          prop="active"
          label="当前进度"
          width="210"
          >
          <template slot-scope="scope">
            <el-tag :type="activeArr[scope.row.active].type">
              {{activeArr[scope.row.active].label}}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column
          label="操作"
          width="230"
          >
        <template slot-scope="scope">
          <el-button 
          @click="toEditFund('select', scope.row.order_id)" 
          size="mini" type="success" 
          >查看</el-button>
          <el-button 
          @click="toEditFund('edit', scope.row.order_id)" 
          size="mini" type="primary" 
          :disabled="myUser.grade !== 0">编辑</el-button>
          <el-button 
          @click="showDelDialog(scope.row.order_id)" 
          size="mini" type="danger" 
          :disabled="myUser.useraccount!=='admin'">删除</el-button>
        </template>
        </el-table-column>
      </el-table>
      <!-- 对话框 -->
      <el-dialog
        title="删除单据信息"
        :visible.sync="delDialogVisible"
        width="30%">
        <span>是否删除？（删除后将无法恢复）</span>
        <span slot="footer" class="dialog-footer">
          <el-button @click="delDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="delFund">确 定</el-button>
        </span>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import Tab from '../../Tab.vue';
import Search from '../../Search.vue';
import { getToken } from '../../../util';

export default {
  data() {
    return {
      myUser: {},
      funds: [],
      activeArr: [{
          type: "warning",
          label: "学校已汇款，工信部未汇款",

        }, {
          type: "success",
          label:  "工信部已汇款，财务未分配"
        }, {
          type: "info",
          label: "财务已发配"
        }
      ],
      order_id: '',
      delDialogVisible: false
    }
  },
  components: {
    Search,
    Tab
  },
  mounted() {
    this.myUser = getToken();
    this.getfunds();
  },
  methods: {
    searchTo(e) {
      this.getfunds(e);
    },
    async getfunds(year) {
      year = year ? ('?order_id=' + year) : '';
      let { data } = await this.$http.get('/fund' + year);
      // console.log(data);
      this.funds = data.data
    },
    toEditFund(type, id = '') {
      this.$router.push(`/fund_edit?type=${type}&order_id=${id}`);
    },
    showDelDialog(order_id) {
      this.order_id = order_id;
      this.delDialogVisible = true;
    },
    async delFund() {
      let { data } = await this.$http.post('/fund/remove', {
        token: getToken().token,
        order_id: this.order_id
      });
      let { status, message } = data;
      this.$message({
        type: status === 0 ? 'success' : 'warning',
        message
      });
      this.getfunds();
      this.delDialogVisible = false;
    }
  }
}
</script>
