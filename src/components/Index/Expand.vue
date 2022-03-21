<template>
  <div class="my_page_pd">
    <Tab
      className="my_container"
      title="一站直达"
    />
    <el-row class="my_container">
      <el-button
        @click="showEditExpandDialog({type: 'add', title: '添加导航'})"
        type="primary"
        :disabled="myUser.grade === 2"
      >添加导航</el-button>
      <el-table
        class="my_top"
        :data="list"
        stripe
        style="width: 100%"
        :border=true
      >
        <el-table-column
          prop="title"
          label="标题"
          width="150"
        >
        </el-table-column>
        <el-table-column
          label="图片"
          width="75"
        >
          <template slot-scope="scope">
            <img
              :src="BASE_URL + scope.row.img_url"
              alt=""
            >
          </template>
        </el-table-column>
        <el-table-column
          prop="path"
          label="地址"
        >
        </el-table-column>
        <el-table-column
          label="操作"
          width="150"
        >
          <template slot-scope="scope">
            <el-button
              @click="showEditExpandDialog({type: 'edit', item: scope.row, title: '编辑导航' })"
              size="mini"
              type="primary"
              :disabled="myUser.grade === 2"
            >编辑</el-button>
            <el-button
              @click="showDelExpandDialog(scope.row.id)"
              size="mini"
              type="danger"
              :disabled="myUser.grade === 2"
            >删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-row>
    <!-- 删除对话框 -->
    <el-dialog
      title="删除导航"
      :visible.sync="delExpandDialogVisible"
      width="30%"
    >
      <span>确定要删除该导航吗?</span>
      <span
        slot="footer"
        class="dialog-footer"
      >
        <el-button @click="delExpandDialogVisible = false">取 消</el-button>
        <el-button
          type="primary"
          @click="DelExpand"
        >确 定</el-button>
      </span>
    </el-dialog>
    <!-- 发布或者修改 -->
    <el-dialog
      :title="paramObj.title"
      :visible.sync="editExpandDialogVisible"
      width="70%"
    >
      <el-form
        ref="article"
        :model="expand"
        label-width="80px"
      >
        <el-form-item label="标题">
          <el-col :span="5">
            <el-input v-model="expand.title"></el-input>
          </el-col>
        </el-form-item>
        <el-form-item label="地址">
          <el-col>
            <el-input v-model="expand.path"></el-input>
          </el-col>
        </el-form-item>
        <el-form-item label="图标">
          <el-upload
            action=""
            list-type="picture-card"
            :on-change="changeFile"
            :on-exceed="changeFile"
            :multiple=false
            :limit=1
            :file-list="fileList"
            :auto-upload="false"
          >
            <i class="el-icon-plus"></i>
          </el-upload>
        </el-form-item>
        <el-form-item>
          <el-button
            type="primary"
            @click="onSubmit"
          >确定</el-button>
          <el-button @click="cancelShowEdit">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import Tab from "../Tab.vue";
import { BASE_URL, getToken } from "../../util";

export default {
  name: "List",
  components: {
    Tab,
  },
  data() {
    return {
      list: [],
      BASE_URL: BASE_URL + "/",
      delExpandDialogVisible: false,
      id: "",
      expand: {},
      editExpandDialogVisible: false,
      // 上传文件
      imgDialogImageUrl: "", // 展示地址
      imgDialogVisible: false, // 是否预览
      uploadfile: {},
      fileList: [],
      img_url: "",
      paramObj: {},
      myUser: getToken()
    };
  },
  mounted() {
    this.getList();
  },
  methods: {
    async getList() {
      const { data } = await this.$http.get("/expand");
      this.list = data.data;
      this.expand = {};
      this.paramObj = {};
      this.fileList = [];
    },
    // 显示删除对话框
    showDelExpandDialog(id) {
      this.id = id;
      this.delExpandDialogVisible = true;
    },
    async DelExpand() {
      this.delExpandDialogVisible = false;
      const { data } = await this.$http.post("/expand/remove", {
        token: getToken().token,
        id: this.id,
      });
      this.$message({
        message: data.message,
        type: data.data ? "success" : "error",
        duration: 1500,
      });
      this.getList();
    },
    // 修改
    async onSubmit() {
				if (!this.expand.title) return this.$message({ message: "标题不能为空", type: "warning" });
			if (!this.expand.path) return this.$message({ message: "导航地址不能为空", type: "warning" });
			const isok = await this.upload();
      if (!isok) return this.$message({ message: "图片不能为空", type: "warning" });
      this.editExpandDialogVisible = false;
      if (this.paramObj.type === "add") await this.addExpand();
      else if (this.paramObj.type === "edit") await this.updateExpand();
      this.getList();
      this.expand = [];
    },
    // 更换图片时图片
    changeFile(file) {
      if (file.url !== undefined) {
        this.uploadfile = file.raw;
        this.fileList = [
          {
            name: file.name,
            url: file.url,
          },
        ];
      } else {
        this.uploadfile = file[0];
        this.fileList = [
          {
            name: file[0].name,
            url: window.URL.createObjectURL(file[0]),
          },
        ];
      }
    },
    // 上传文件
    async upload() {
			if (!this.uploadfile) return false;
      var fd = new FormData();
      fd.append("file", this.uploadfile);
      const { data } = await this.$http.post("/upload", fd);
      const { url } = data;
      if (!url) return;
      this.img_url = url;
      this.expand.img_url = url;
			return true;
    },
    // 显示编辑对话框
    showEditExpandDialog(paramObj) {
      this.editExpandDialogVisible = true;
      const { item, type } = paramObj;
      if (type === "edit") {
        this.expand = item;
        this.fileList = [
          {
            name: item.img_url.replace("/images/", ""),
            url: this.BASE_URL + item.img_url,
          },
        ];
      }
      this.paramObj = paramObj;
    },
    // 取消编辑或者发布
    cancelShowEdit() {
      this.getList();
      this.editExpandDialogVisible = false;
    },
    async addExpand() {
      const { data } = await this.$http.post("/expand/add", {
        img_url: this.img_url,
        ...this.expand,
        token: getToken().token,
      });
      this.$message({
        message: data.message,
        type: data.data ? "success" : "error",
      });
    },
    async updateExpand() {
      console.log(this.expand);
      const { data } = await this.$http.post("/expand/edit", {
        ...this.expand,
        token: getToken().token,
      });
      this.$message({
        message: data.message,
        type: data.data ? "success" : "error",
      });
    },
  },
};
</script>

<style scoped lang="scss">
.my_top {
  img {
    width: 50px;
  }
}
</style>
