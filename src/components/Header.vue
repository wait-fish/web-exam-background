<template>
  <div class="header_box">
      <div class="header_left">
          <span class="text">{{info.useraccount}}</span> |
          <span class="text">{{gradeNames[info.grade]}}</span>
          <span v-if="info.remark">
            |  <span class="text">{{info.remark}}</span>
          </span>
      </div>
      <div class="header_right" @click="outLogin">
          Out Login 
          <span class="iconfont icon-tuichu"></span>
      </div>
  </div>
</template>

<script>
import { getToken, isAuth, removeToken, gradeNames } from '../util'
export default {
  data() {
    return {
      info: {},
      gradeNames,
      timer: null,
    }
  },
  mounted() {
    if (!isAuth()) return this.$router.replace("/login"); 
    let { token, ...rest } = getToken(); 
    this.info = rest;
  },
  unmounted() {
  },
  methods: {
    outLogin() {
      removeToken();
      this.$router.replace("/");
    }
  }
}
</script>

<style lang="scss">
.header_box {
  box-sizing: border-box;
  display: flex;
  width: 100%;
  height: 50px;
  background-color: #fff;
  box-shadow: 0px 0px 10px rgba(0, 0, 0, .05);
  justify-content: space-between;
  align-items: center;
  padding: 0 20px;

  .header_left {
    color: #dedede;

    .text {
      color: #888;
      font-family: "微软雅黑";
      font-size: 14px;
    }
  }

  .header_right {
    margin-right: 20px;
    cursor: pointer;
    color: #333;
    height: 50px;
    line-height: 50px;
    padding: 0 5px;

    .tuichu {
      color: #333;
      font-weight: 600;
    }

    &:hover {
      background-color: #fafafa;
    }
  }
}
</style>