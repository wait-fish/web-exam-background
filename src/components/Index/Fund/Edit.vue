<template>
  <div class="my_page_pd">
    <Tab className="my_container" title="财务管理" :title2="titleInfo[type] + '单据'" />
    <div class="my_container">
      <el-form class="marginLR my_top" ref="form" :model="fund" label-width="100px">
        <el-form-item label="报名日期区间">
          <el-date-picker
            :disabled="isDisabled"
            @change="dateChange"
            v-model="registrationDate"
            type="daterange"
            value-format="yyyy-MM-dd"
            range-separator=" 至 "
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            style="width: 240px;">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="报名学生人数">
          <el-input :disabled="isDisabled" style="width: 60px;" v-model="fund.students"></el-input><span class="my_label">人</span>
        </el-form-item>
        <el-form-item label="报名费">
          <el-input :disabled="isDisabled" style="width: 80px;" v-model="fund.student_registration_fee"></el-input>
          <span class="my_label">元/人</span>
        </el-form-item>
        <el-form-item label="报名总金额">
          <span 
          style="display:inline-block;color: #333;font-weight: 550;padding: 0 5px; border-radius: 5px;"
          >{{registration_fee_total}}</span>
          <span class="my_label">元</span><p style="display: inline;padding-left: 20px;color: #999;">(报名学生人数 * 报名费)</p>
        </el-form-item>
        <el-form-item label="学校->工信部汇款存根">
          <el-upload
            :disabled="isDisabled"
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
        <el-divider></el-divider>
        <el-form-item label="考务费">
          <el-input :disabled="isDisabled" style="width: 80px;" v-model="fund.teacher_fee"></el-input>
          <span class="my_label">元/人</span>
        </el-form-item>
        <el-form-item label="考务费总金额">
            <span 
          style="display:inline-block;color: #333;font-weight: 550;padding: 0 5px; border-radius: 5px;"
          >{{exam_fee_total}}</span>
          <span class="my_label">元</span>
          <p style="display: inline;padding-left: 20px;color: #999;">(报名学生人数 * 考务费)</p>
        </el-form-item>
        <el-form-item label="其他费用" v-show="!isDisabled">
            <el-input name="name" style="width: 200px;" v-model="other.name" type="text" placeholder="费用名，如：考场费" />
            <h2 style="display: inline;"> - </h2>
            <el-input 
            name="fee" 
            style="width: 80px;" 
            v-model="other.fee" 
            type="text" 
            placeholder="100"
            @keyup.enter="addTeacherInfo" />
            <span class="my_label" style="padding-right: 10px;">元</span>
            <el-button type="info" @click="addOther" >添加</el-button>
        </el-form-item>
        <el-form-item label="费用清单" :style="isDisabled ? 'width: 391px;' : 'width: 451px;'">
          <el-table :data="fund.other_fee" :border="true" stripe size="mini">
            <el-table-column prop="name" label="用途" width="190" />
            <el-table-column prop="fee" label="费用（元）" width="100" />
            <el-table-column
              label="操作"
              width="60" v-if="!isDisabled">
              <template slot-scope="scope">
                <el-button
                  @click.native.prevent="deleteRow(scope.$index, 'other_fee')"
                  type="text"
                  size="small">
                  移除
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-form-item>
        <el-form-item label="老师人均费用" v-show="!isDisabled">
            <el-input style="width: 100px;" v-model="teacher_info.name" type="text" placeholder="姓名" />
            <h2 style="display: inline;"> - </h2>
            <el-input 
            style="width: 120px;padding-right: 10px;" 
            v-model="teacher_info.classroom" type="text" 
            @keyup.enter="addTeacherInfo"
            placeholder="负责教室" />
            <el-button type="info" @click="addTeacherInfo" >添加</el-button>
        </el-form-item>
        <el-form-item label="老师名单" :style="isDisabled ? 'width: 391px;' : 'width: 451px;'">
          <el-table :data="teacher_info_list" :border="true" stripe size="mini">
            <el-table-column prop="name" label="姓名" width="90" />
            <el-table-column prop="fee" label="费用（元）" width="100" />
            <el-table-column prop="classroom" label="教室" width="100" />
            <el-table-column
              label="操作"
              width="60" v-if="!isDisabled">
              <template slot-scope="scope">
                <el-button
                  @click.native.prevent="deleteRow(scope.$index, 'teacher_info_list')"
                  type="text"
                  size="small">
                  移除
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-form-item>
        <el-form-item label="工信部->学校拨款存根">
          <el-upload
           :disabled="isDisabled"
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
        <el-form-item label="当前进度">
          <el-select :disabled="isDisabled" v-model="fund.active" placeholder="请选择当前进度">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button @click="toExecl" type="success">导出详单</el-button>
          <el-button v-show="!isDisabled" @click="showDialogVisible = true" type="primary">上 传</el-button>
          <el-button @click="$router.replace('/fund')">返回</el-button>
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
import transform from './ExeclOperate/toExecl'

export default {
  data() {
    return {
      BASE_URL,
      registrationDate: null,
      stubFileList: [],
      invoiceFileList: [],
      fund: {
        students: 0,
        student_registration_fee: 300.00,
        registration_fee_total: 0,
        stub_img: '',
        teacher_fee: 120.00,
        exam_fee_total: 0,
        invoice_img: '',
        active: 0,
        other_fee: [],
        teacher_info_list: []
      },
      type: '',
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
      uploadfile2: {},
      options: [{
        value: 0,
        label: '学校已汇款，工信部未汇款'
      }, {
        value: 1,
        label: '工信部已汇款，财务未分配'
      }, {
        value: 2,
        label: '财务已发配'
      }],
      other: { name: '', fee: 0 }, // 其他费用
      teacher_info: { name: '', fee: 0, classroom: ''  }, // 老师信息
      titleInfo: {
        add: '添加',
        edit: '编辑',
        select: '查看'
      }
    }
  },
  components: {
    Tab
  },
  computed: {
    // 学校总汇款
    registration_fee_total() {
      this.fund.registration_fee_total = this.fund.students * this.fund.student_registration_fee
      return this.fund.registration_fee_total
    }, // 总考务费
    exam_fee_total() {
      this.fund.exam_fee_total =  this.fund.students * this.fund.teacher_fee
      return this.fund.exam_fee_total
    },
     // 老师人均费用
    teacher_info_list() {
      let other_fee = 0
      this.fund.other_fee.forEach(item => other_fee += Number(item.fee))

      let average = (this.exam_fee_total - other_fee) / this.fund.teacher_info_list.length | 0
      this.fund.teacher_info_list = this.fund.teacher_info_list.map(item => ({ name: item.name, fee: average, classroom: item.classroom }))
      return this.fund.teacher_info_list
    },
    isDisabled() {
      return this.type === 'select'
    }
  },
  mounted() {
    this.loadData();
  },
  methods: {
    toExecl() {
      transform([this.fund], 'test');
    },
    deleteRow(index, rowsName) {
      this.fund[rowsName].splice(index, 1)
    },
    addOther() {
      const { name, fee } = this.other 
      if (name.trim() == '' || fee.trim() == '') return
      this.fund.other_fee  = [...this.fund.other_fee, this.other]
      this.other = {}
    },
    addTeacherInfo() {
      const { name, classroom } = this.teacher_info 
      if (name.trim() == '' || classroom.trim() == '') return
      this.fund.teacher_info_list  = [...this.fund.teacher_info_list, this.teacher_info]
      this.teacher_info = {}
    },
    async loadData() {
      let { type, order_id } = this.$route.query;
      this.type = type;
      if (type === 'add') return
      let { data } = await this.$http.get('/fund?order_id=' + order_id);
      this.fund = data.data[0];
      this.fileList1 = this.fund.stub_img ? [{name: new Date().getTime(), url: BASE_URL + '/' + this.fund.stub_img }] : [];
      this.fileList2 = this.fund.invoice_img ? [{name: new Date().getTime(), url: BASE_URL + '/' + this.fund.invoice_img }] : [];
      this.registrationDate = [order_id.split('|')[0], order_id.split('|')[1]];
      { // 转JSON
        this.fund.other_fee = JSON.parse(this.fund.other_fee)
        this.fund.teacher_info_list = JSON.parse(this.fund.teacher_info_list)
      }
      
    },// 操作数据
    async operateFund() {
      console.log(this.fund);
      let stub_img = await this.upload('uploadfile1');
      let invoice_img = await this.upload('uploadfile2');
      this.fund.stub_img = stub_img;
      this.fund.invoice_img = invoice_img;
      if (this.type === 'add') {
        this.showDialogVisible = false;
        this.fund.order_id = this.getOrderId();
        if (!this.fund.order_id) return
      }
      { // 转字符串
        this.fund.other_fee = JSON.stringify(this.fund.other_fee)
        this.fund.teacher_info_list = JSON.stringify(this.fund.teacher_info_list)
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
      if (numberName === 'students') this.fund.registration_fee_total = this.fund.students * this.fund.student_price;
      else this.fund.exam_fee_total = this.fund.students * this.fund.teacher_fee;
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