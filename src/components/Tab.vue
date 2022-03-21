<template>
  <el-row :class="className">
      <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/charts' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>{{title}}</el-breadcrumb-item>
      <el-breadcrumb-item v-if="title2 !== ''">{{title2}}</el-breadcrumb-item>
    </el-breadcrumb>
    </el-row>
</template>

<script>
export default {
  name: 'Tab',
  props: {
    title: {
      type: String,
      default: '前台用户管理'
    },
    title2: {
      type: String,
      default: ''
    },
    className: {
      type:String,
      default: ''
    }
  }
}
</script>

<style scoped lang="scss">
.my_container {
  padding: 15px;
  .el-breadcrumb {
    font-size: 16px;
  }
}
</style>
