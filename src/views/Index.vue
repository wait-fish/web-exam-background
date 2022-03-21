<template>
  <div class="page">
    <Aside />
    <div class="right_box">
      <Header />
      <div class="main">
        <router-view />
      </div>
      <div class="footer">
          <p>© 2022-2099 广东工程职业技术学院 信息工程学院</p>
      </div>
    </div>
  </div>
</template>

<script>
import Aside from "../components/Aside.vue";
import Header from "../components/Header.vue";
export default {
  components: {
    Aside,
    Header
  }
}
</script>

<style lang="scss">
.page {
  display: flex;

  .right_box {
    width: 100%;
  }

  .main {
    width: 100%;
  }

  .footer{
  display: flex!important;
  justify-content: center;
  align-items: center;
  height: auto!important;
  color: #666;
  font-size: 14px;
  padding: 20px 0;
  }
}
</style>
