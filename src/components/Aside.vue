<template>
  <el-aside
    class="aside"
    width="200px"
  >
    <div class="logo">
      <i>1+x考试管理系统</i>
    </div>
    <el-row>
      <el-col>
        <el-menu
          :default-active="activeKey"
          :active="activeKey"
          class="el-menu-vertical-demo"
          background-color="var(--color)"
          text-color="rgba(255,255,255,0.75)"
          active-text-color="rgba(255,255,255)"
          @select="handleSelect"
          :router=true
        >
          <el-menu-item v-for="item in nav" :index="item.index" :key="item.index">
            <i :class="'iconfont ' + item.icon"></i>
            <span slot="title">{{item.title}}</span>
          </el-menu-item>
        </el-menu>
      </el-col>
    </el-row>
  </el-aside>
</template>

<script>
export default {
  name: "Aside",
  data() {
    return {
      activeKey: "admin",
      nav: [
        {
          index: "admin",
          icon: "icon-zhanghaoquanxianguanli",
          title: "账号权限管理"
        },
        {
          index: "student_account",
          icon: "icon-xueshengguanli",
          title: '学生账号管理'
        },
        {
          index: "student",
          icon: "icon-xueshengxinxicaiji",
          title: "报名信息管理"
        },
        {
          index: "score",
          icon: "icon-chengjiguanli",
          title: "成绩管理"
        },
        {
          index: "charts",
          icon: "icon-baobiaoguanli",
          title: "数据可视化"
        },
        {
          index: "fund",
          icon: "icon-caiwuguanli",
          title: "财务管理"
        },
        {
          index: "menu",
          icon: "icon-ziduanguanli",
          title: "选项管理"
        },
        {
          index: "files",
          icon: "icon-wenjianguanli",
          title: "考试资料管理"
        },
        {
          index: "images",
          icon: "icon-tupian_huaban",
          title: "图片管理"
        },
        {
          index: "expand",
          icon: "icon-liuchengguanli",
          title: "一站直达"
        }
      ]
    };
  },
  mounted() {
    let { name } = this.$router.history.current;
    this.activeKey = name === 'index' ? 'student' : name;
  },
  methods: {
    handleSelect(key, keyPath) {
      this.activeKey = key;
    },
  },
};
</script>

<style scoped lang="scss">
.el-menu-vertical-demo {
  border-right: none!important;
}
.aside {
  user-select: none;
  box-sizing: border-box!important;
  background-color: var(--color);
  min-height: 100vh;
  border-right: 1px solid #fefefe;
  box-shadow: 0px 20px 15px rgba(0, 0, 0, 0.1);

  .el-menu-item:hover {
    background-color: rgba(255,255,255,0.3)!important;
  }

  .is-active {
    .iconfont {
      color: #fff;
    }
  }

  .logo {
    color: #fff;
    opacity: 0.9;
    box-sizing: border-box;
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 20px;
    font-weight: 550;
    height: 50px;
    border-bottom: 1px solid #fff;
  }
  .iconfont {
    margin-right: 10px;
    color: rgba(255,255,255,0.75);
    font-size: 18px;
  }
}

</style>
