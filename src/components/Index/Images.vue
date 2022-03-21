<template>
  <div class="my_page_pd">
    <Tab className="my_container" title="图片管理" />
    <div class="my_container">
      <el-button :disabled="myUser.grade === 2" @click="dialogVisible=true" type="primary" class="my_flex">上传图片</el-button>
      <div class="my_top gird">
        <div v-for="item in images" :key="item.id">
          <el-image :preview-src-list="srcList" style="height: 150px;" :src="BASE_URL + item.url" :lazy="true" fit="cover" />
          <div class="info">
            <h3>{{item.remark}}.{{item.url.split(".")[1]}}</h3>
            <p>{{new Date(item.update_time).toLocaleString()}}</p>
          </div>
          <div class="del_show" @click="delImage(item.id)">
            <img src="../../assets/shanchu.png" alt="">
          </div>
        </div>
      </div>
    </div>
    <el-dialog
      title="上传图片"
      :visible.sync="dialogVisible"
      width="500px"
      :before-close="handleClose">
       <el-form :model="imageObj">
          <el-form-item label="图片备注" prop="name" label-width="80px">
            <el-input style="width: 250px;" v-model="imageObj.remark"></el-input>
          </el-form-item>
          <el-form-item label="图片" label-width="80px">
            <el-upload
              action=""
              list-type="picture-card"
              :on-exceed="changeFile"
              :on-change="changeFile"
              :multiple=false
              :limit=1
              :file-list="fileList"
              :auto-upload="false"
              >
              <i class="el-icon-plus"></i>
            </el-upload>
          </el-form-item>
        </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleClose">取 消</el-button>
        <el-button type="primary" @click="uploadImage">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { getToken, BASE_URL } from '../../util';
import Tab from '../Tab.vue';
export default {
  components: {
    Tab
  },
  data() {
    return {
      dialogVisible: false,
      imageObj: {},
      fileList: [],
      images: [],
      BASE_URL: BASE_URL + '/',
      srcList: [],
      myUser: getToken()
    }
  },
  mounted() {
    this.getImages();
  },
  methods: {
    handleClose() {
      this.imageObj = {};
      this.dialogVisible = false;
    },
    changeFile (file) {
      this.fileList = [file]
    },
    async upload() {
      let fd = new FormData();
      // console.log(this.fileList);
      fd.append('file', this.fileList[0].raw); 
      const { data } = await this.$http.post('/upload', fd);
      return data.url;
    },
    async uploadImage() {
      if (!this.imageObj.remark) {
        return this.$message({ message: '备注不能为空', type: 'warning' });
      }
      if (!this.fileList.length) return this.$message({ message: '图片不能为空', type: 'warning' });
      const url = await this.upload();
      // console.log(url);
      if (!url) return this.$message({ message: '图片上传失败', type: 'error' });
      const { data } = await this.$http.post('/images/add', {
        token: getToken().token,
        ...this.imageObj,
        url
      });
      this.$message({
        message: data.message,
        type: data.data ? 'success' : 'error'
      });
      this.handleClose();
      this.getImages();
    },
    async getImages() {
      const { data } = await this.$http("/images");
      this.images = data.data;
      this.srcList = this.images.map(item => this.BASE_URL + '/' + item.url);
    },
    delImage(id) {
      this.$confirm('此操作将永久删除该图片, 是否继续?', '提示', {
          confirmButtonText: '确定',
          type: 'warning'
        }).then(async () => {
          const { data } = await this.$http.post("/images/remove", {
            token: getToken().token,
            id
          })
          this.$message({
            message: data.message,
            type: data.data ? 'success' : 'error'
          });
          this.getImages();
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });          
        });
    }
  }
}
</script>

<style lang="scss" scoped>
.gird {
  margin: 20px auto;
  display: grid;
  grid-template-columns: repeat(5, 200px);
  grid-gap: 20px;
  justify-content: center;
  
  div {
    position: relative;
    border-radius: 5px;
    box-shadow: 1px 0px 10px rgba(0, 0, 0, 0.02);
    overflow: hidden;
    transition: 0.3s;

    &:hover {
      box-shadow: 1px 0px 10px rgba(0, 0, 0, 0.15);
    }

    .info {
      width: 200px;
      overflow: hidden;

      h3 {
        font-weight: 500;
        text-align: center;
        padding-top: 15px;
        font-size: 16px;
      }

      p {
        margin-top: 10px;
        font-size: 12px;
        text-align: center;
        color: #bbb;
      }
    }

    .del_show {
      position: absolute;
      top: 0;
      bottom: 0;
      width: 100%;
      background-color: rgba(0, 0, 0, .75);
      transform: translateY(100%);
      display: flex;
      justify-content: center;
      cursor: pointer;

      img {
        margin-top: 20px;
        width: 25px;
        height: 25px;
      }
    }

    &:hover .del_show{
      transform: translateY(70%);
    }
  }

}
</style>