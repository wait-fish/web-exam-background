<template>
  <div class="my_page_pd">
    <Tab className="my_container" title="财务管理" :title2="title + '单据'" />
    <div class="my_container">
      <el-steps simple class="marginLR" :active="fund.active" finish-status="success">
        <el-step title="学校汇款"></el-step>
        <el-step title="工信部汇款"></el-step>
        <!-- <el-step title="数据确认"></el-step> -->
      </el-steps>
      <!-- 填写区域 -->
      <el-form class="marginLR my_top" ref="form" :model="fund" label-width="100px">
        <!-- 步骤1 -->
        <div v-show="fund.active === 0 || fund.active  >= 2">
          <el-form-item label="报名日期区间">
            <el-date-picker
              :disabled="fund.active >= 2 || type === 'edit'"
              @change="dateChange"
              v-model="registrationDate"
              type="daterange"
              value-format="yyyy-MM-dd"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              style="width: 240px;">
            </el-date-picker>
          </el-form-item>
          <el-form-item label="报名人数">
            <el-input @input="numberHandle('students')" :disabled="fund.active  >= 2" style="width: 60px;" v-model="fund.students"></el-input>
          </el-form-item>
          <el-form-item label="报名费">
            <el-input :disabled="fund.active  >= 2" style="width: 80px;" v-model="fund.student_price"></el-input>
            <span class="my_label">元/人</span>
          </el-form-item>
          <el-form-item label="报名总金额">
            <el-input :disabled="fund.active  >= 2" style="width: 100px;" v-model="fund.registery_fee_total"></el-input>
            <span class="my_label">元</span>
          </el-form-item>
          <el-form-item label="存根">
            <el-upload
              :disabled="fund.active  >= 2"
              action=""
              list-type="picture-card"
              :on-preview="handlePictureCardPreview1"
              :on-exceed="changeFile1"
              :on-change="changeFile1"
              :multiple=false
              :limit=1
              :file-list="fileList1"
              :auto-upload="false"
              >
              <i class="el-icon-plus"></i>
            </el-upload>
            <el-dialog :visible.sync="imgDialogVisible1">
              <img width="100%" :src="imgDialogImageUrl1" alt="">
            </el-dialog>
          </el-form-item>
        </div>
        <!-- 步骤2 -->
        <div v-show="fund.active === 1 || fund.active  >= 2">
          <el-form-item label="考务人数">
            <el-input @input="numberHandle('teachers')" :disabled="fund.active  >= 2" style="width: 60px;" v-model="fund.teachers"></el-input>
          </el-form-item>
          <el-form-item label="考务费">
            <el-input :disabled="fund.active  >= 2" style="width: 80px;" v-model="fund.teacher_price"></el-input>
            <span class="my_label">元/人</span>
          </el-form-item>
          <el-form-item label="考务费总金额">
            <el-input :disabled="fund.active  >= 2" style="width: 100px;" v-model="fund.exam_fee_total"></el-input>
            <span class="my_label">元</span>
          </el-form-item>
          <el-form-item label="存根">
            <el-upload
              :disabled="fund.active  >= 2"
              action=""
              list-type="picture-card"
              :on-preview="handlePictureCardPreview2"
              :on-exceed="changeFile2"
              :on-change="changeFile2"
              :multiple=false
              :limit=1
              :file-list="fileList2"
              :auto-upload="false"
              >
              <i class="el-icon-plus"></i>
            </el-upload>
            <el-dialog :visible.sync="imgDialogVisible2">
              <img width="100%" :src="imgDialogImageUrl2" alt="">
            </el-dialog>
          </el-form-item>
        </div>
        <el-form-item>
          <el-button :disabled="(type === 'edit' && fund.active < 2)" @click="showDialogVisible = true" type="primary">上 传</el-button>
          <el-button 
          type="info" 
          style="margin-top: 12px;"
          :disabled="fund.active <= 0" 
          @click="pre">上一步</el-button>
          <el-button :disabled="fund.active >= 2" type="info" style="margin-top: 12px;" @click="next">下一步</el-button>
          <el-button @click="$router.replace('/fund')">取 消</el-button>
        </el-form-item>
      </el-form>
    </div>
    <!-- 对话框 -->
    <el-dialog
      title="确定要上传吗"
      :visible.sync="showDialogVisible"
      width="30%">
      <span>请认真检查，再次确认是否上传？</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="showDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="operateFund">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import Tab from '../../Tab.vue';
import { BASE_URL, getToken } from '../../../util'

export default {
  data() {
    return {
      BASE_URL,
      registrationDate: null,
      stubFileList: [],
      invoiceFileList: [],
      fund: {
        students: 0,
        student_price: 300.00,
        registery_fee_total: 0,
        stub_img: '',
        teachers: 0,
        teacher_price: 120.00,
        exam_fee_total: 0,
        invoice_img: '',
        active: 0,
      },
      type: '',
      title: '添加',
      showDialogVisible: false,
      // 上传文件1
      imgDialogImageUrl1: '',
      imgDialogVisible1: false,
      fileList1: [],
      uploadfile1: {},
      // 上传文件2
      imgDialogImageUrl2: '',
      imgDialogVisible2: false,
      fileList2: [],
      uploadfile2: {}
    }
  },
  components: {
    Tab
  },
  mounted() {
    this.loadData();
  },
  methods: {
    async loadData() {
      let { type, order_id } = this.$route.query;
      this.type  = type;
      this.title = type === 'add' ? '添加' : '编辑' ;
      if (this.type === 'edit') {
        let { data } = await this.$http.get('/fund?order_id=' + order_id);
        this.fund = data.data[0];
        this.fileList1 = this.fund.stub_img ? [{name: new Date().getTime(), url: BASE_URL + '/' + this.fund.stub_img }] : [];
        this.fileList2 = this.fund.invoice_img ? [{name: new Date().getTime(), url: BASE_URL + '/' + this.fund.invoice_img }] : [];
        this.registrationDate = [order_id.split('|')[0], order_id.split('|')[1]];
      }
    },
    next() {
      if (++this.fund.active > 2) this.fund.active = 2;
    },
    pre() {
      if (--this.fund.active < 0) this.fund.active = 0;
    },// 操作数据
    async operateFund() {
      let stub_img = await this.upload('uploadfile1');
      let invoice_img = await this.upload('uploadfile2');
      this.fund.stub_img = stub_img;
      this.fund.invoice_img = invoice_img;
      if (this.type === 'add') {
        this.fund.order_id = this.getOrderId();
      }
      let { data } = await this.$http.post(`/fund/${this.type}`, {
          token: getToken().token,
          ...this.fund
        });
      let { status, message } = data;
      this.$message({
        type: status === 0 ? 'success' : 'warning',
        message
      });
      this.showDialogVisible = false;
      setTimeout(() => {
        this.$router.replace('/fund');
      }, 1000);
    },// 获取id
    getOrderId() {
      if (this.registrationDate == null) {
        this.$message({
          type: 'warning', message: '报名区间不能为空'
        });
        return null;
      }
      return this.registrationDate[0]  + '|' + this.registrationDate[1] + '|' + new Date().getTime();
    },// 日期变化时
    async dateChange() {
      if (this.type !== 'add') return;
      let { data } = await this.$http.get(`/student/date_count?startDate=${this.registrationDate[0]}&endDate=${this.registrationDate[1]}`);
      this.fund.students = data.data.count;
      this.numberHandle('students');
    },
    numberHandle(numberName) {
      if (numberName === 'students') this.fund.registery_fee_total = this.fund.students * this.fund.student_price;
      else this.fund.exam_fee_total = this.fund.teachers * this.fund.teacher_price;
    },
    // 上传图片1
     // 预览图片
    handlePictureCardPreview1 (file) {
      this.imgDialogImageUrl1 = file.url
      this.imgDialogVisible1 = true
    },
    // 更换图片时图片
    changeFile1 (file) {
      if (file.url !== undefined) {
        this.uploadfile1 = file.raw
        this.myFileList1 = [{
          name: file.name,
          url: file.url
        }]
      } else {
        this.uploadfile1 = file[0]
        this.myFileList1 = [{
          name: file[0].name,
          url: window.URL.createObjectURL(file[0])
        }]
      }
    },
    async upload (name) {
      let fd = new FormData();
      fd.append('file', this[name]); 
      const { data } = await this.$http.post('/upload', fd);
      return data.url;
    },
    // 上传文件2
    // 预览图片
    handlePictureCardPreview2 (file) {
      this.imgDialogImageUrl2 = file.url
      this.imgDialogVisible2 = true
    },
    // 更换图片时图片
    changeFile2 (file) {
      if (file.url !== undefined) {
        this.uploadfile2 = file.raw
        this.myFileList2 = [{
          name: file.name,
          url: file.url
        }]
      } else {
        this.uploadfile2 = file[0]
        this.myFileList2 = [{
          name: file[0].name,
          url: window.URL.createObjectURL(file[0])
        }]
      }
    },
  }
}
</script>

<style lang="scss" scope>
  .marginLR {
    margin-left: 60px;
    margin-right: 60px;
  }
  .my_label {
    margin-left: 10px;
    color: #666;
  }
</style>