<template>
  <div class="my_page_pd">
    <Tab className="my_container" title="考试资料管理" />
    <div class="my_container">
      <div class="my_flex">
        <el-button :disabled="myUser.grade === 2" @click="$router.push('/files_add')" type="primary">上传资料</el-button>
      </div>
      <el-collapse class="my_top collapse" v-model="activeName" accordion>
        <el-collapse-item
        v-for="(item, index) in data_files"
        :key="item.year" 
        :title="item.year + '年度'" 
        :name=index>
          <ol style="list-style-type: square!important;" 
          v-for="item2 in item.children"
          :key="item2.id"
          >
            <li class="file_item_bg">
              <div class="my_flex" style="align-items: center;">
                <h4 style="width: 850px;overflow: hidden; text-overflow: ellipsis;white-space: nowrap;">{{item2.title}}</h4>
                <div >
                  <el-button size="mini" type="primary" @click="downloadFile(BASE_URL + item2.data_url, item2.title)">下载</el-button>
                  <el-button :disabled="myUser.grade === 2" @click="delDataFile(item2.id)" size="mini" type="danger">删除</el-button>
                </div>
              </div>
            </li>
          </ol>
        </el-collapse-item>
      </el-collapse>
    </div>
  </div>
</template>

<script>
import Tab from '../../Tab.vue';
import { API, BASE_URL, getToken } from '../../../util';
import downloadFile from '../../../util/downloadFile';
export default {
  data () {
    return {
      activeName: 0,
      data_files: [],
      BASE_URL: BASE_URL + '/',
      downloadFile,
      myUser: getToken()
    }
  },
  components: {
    Tab
  },
  mounted() {
    this.getDataFiles();
  },
  methods: {
    async getDataFiles() {
      const res = await API.get("/data_files");
      this.data_files = res.data.data;
      // console.log(this.data_files);
    },
    delDataFile(id) {
      if (this.myUser.grade === 2) return;
      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(async () => {
          const { data } = await this.$http.post("/data_files/remove",{
            token: getToken().token,
            id
          });
          const { message } = data;
          this.$message({
            type: data.data == true ? 'success' : 'error',
            message
          })
          this.getDataFiles();
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
/deep/ .el-collapse-item .el-collapse-item__header {
  font-size: 18px!important;
  font-weight: 550!important;
}
.file_item_bg {
  background-color: #fefefe;
  padding: 3px 20px;
  border-radius: 5px;
  margin-top: 5px;
  border-bottom: 1px solid #efefef;

  &:hover {
    background-color: #efefef;
  }
}
</style>