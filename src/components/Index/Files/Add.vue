<template>
  <div class="my_page_pd">
    <Tab className="my_container" title="考试资料管理" title2="上传考试资料文件" />
    <div class="my_container">
      <el-form ref="form" :model="form" label-width="80px">
      <el-form-item label="资料标题">
        <el-input v-model="form.title" style="width: 500px;"></el-input>
      </el-form-item>
      <el-form-item label="所属年度">
        <el-input placeholder="例:2022" v-model="form.year" style="width: 80px;"></el-input>
      </el-form-item>
      <el-form-item label="资料文件" style="width: 300px;">
        <el-upload
        class="upload-demo"
        ref="upload"
        :action="BASE_URL + 'upload'"
        :on-change="changeFile"
        :file-list="fileList"
        :limit=1
        :auto-upload="false">
        <el-button slot="trigger" size="small" type="primary">选取文件</el-button>
      </el-upload>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit">上传资料</el-button>
        <el-button @click="$router.replace('/files')">取消</el-button>
      </el-form-item>
    </el-form>
    </div>
  </div>
</template>

<script>
import Tab from '../../Tab.vue';
import { BASE_URL, getToken } from '../../../util';
export default {
  components: {
    Tab
  },
  data() {
    return {
      form: {
        title: '',
        year: new Date().getFullYear() + ''
      },
      fileList: [],
      BASE_URL: BASE_URL + '/'
    }
  },
  methods: {
    async upload() {
      let fd = new FormData();
      fd.append('file', this.fileList[0].raw); 
      const { data } = await this.$http.post('/upload', fd);
      return data.url;
    },
    changeFile (file) {
      this.fileList = [file];
    },
    async onSubmit() {
      const { title, year } = this.form;
      if (title.trim() === '') {
        return this.$message({
          type: 'warning',
          message: '标题不能为空'
        })
      }
      if (year.trim() === '') {
        return this.$message({
          type: 'warning',
          message: '所属年度不能为空'
        })
      }
			if (!this.fileList[0]) this.$message({
        message: '文件不能为空',
        type: 'warning'
      });
      const data_url = await this.upload();
      if (!data_url) return this.$message({
        message: '上传文件失败',
        type: 'error'
      });
      const { data } = await this.$http.post("/data_files/add",  {
        token: getToken().token,
        ...this.form,
        data_url
      });
      const { message } = data;
      this.$message({
        type: data.data == true ? 'success' : 'error',
        message
      })
      setTimeout(() => {
        this.$router.replace('/files');
      }, 1500);
    }
  }
}
</script>