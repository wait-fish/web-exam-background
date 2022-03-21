<template>
  <div class="body">
    <div class="box" ref="box">
      <div class="box_left">
        <span class="text_logo" :style="'height:' + loginHeight +'px;line-height:'+ loginHeight +'px;'">1+x</span>
      </div>
      <div class="box_right">
        <div class="right_top">
          <h1>考试管理系统</h1>
        </div>
        <form
          class="right_bottom"
          @submit="submitToLogin"
          method="post"
        >
          <p class="uname">
            <input
              placeholder="账号"
              type="text"
            >
            <span class="iconfont icon-zhanghao"></span>
          </p>
          <p class="pwd">
            <input
              placeholder="密码"
              type="password"
            >
            <span class="iconfont icon-password"></span>
          </p>
          <p class="login"><input type="submit" value="立即登录"></p>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import { isAuth, setToken } from "../util";

export default {
  name: "Login",
  data() {
    return {
      loginHeight: 0
    };
  },
  mounted() {
    this.loginHeight = this.$refs.box.offsetHeight;
    if (isAuth()) this.$router.replace("/index");
  },
  methods: {
    async submitToLogin(e) {
      e.preventDefault();
      const useraccount = e.target[0].value;
      const password = e.target[1].value;
      const duration = 2000;

      if (useraccount.trim() === "" || password.trim() === "")
        return this.$message({
          message: "不能为空",
          type: "warning",
          duration,
        });
      const { data: { status, message, data } } = await this.$http.post("/user/login", {
        useraccount,
        password,
      });
      const type = status === 0 ? "success": "error";
      this.$message({ message, type, duration });

      if (status !== 0) return;
      setToken(data);
      setTimeout(() => {
        this.$router.replace("/index");
      }, 1000);
    },
  },
};
</script>

<style scoped lang="scss">
.body {
  background: #f8f8f8;
  width: 100%;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
}

.box {
  background-color: #fff;
  border-radius: 10px;
  padding-right: 70px;
  display: flex;
  align-items: center;
  min-height: 400px;
  box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.05);
  overflow: hidden;

  .box_left {
    margin-right: 50px;
    min-height: 100%;

    .text_logo {
      user-select: none;
      display: block;
      text-align: center;
      font-size: 70px;
      font-weight: 550;
      width: 400px;
      height: 100%;
      letter-spacing: 15px;
      background: var(--color);
      color: #fff;
      font-family: "微软雅黑", "苹方粗体";
    }
  }

  .box_right {
    width: 300px;
    display: flex;
    padding: 70px 0;
    flex-direction: column;
    justify-content: space-around;
    align-items: center;

    .right_top {
      margin-bottom: 20px;

      h1 {
        letter-spacing: 10px;
        color: var(--color);
      }
    }

    .right_bottom {
      p {
        position: relative;

        input {
          box-sizing: border-box;
          font-size: 15px;
          line-height: 1.5;
          color: #999;
          display: block;
          width: 100%;
          background: #eee;
          height: 50px;
          border-radius: 25px;
          padding: 0 30px 0 68px;
          outline: none;
          border: none;
          margin-bottom: 10px;
          font-weight: 550;
        }

        span {
          position: absolute;
          top: 50%;
          left: 35px;
          transform: translateY(-50%);
          color: #888;
          transition: 0.5s;
        }
      }

      .uname:hover,.pwd:hover {
        span {
          left: 27px;
          color: var(--color);
        }
      }

      .login {
        margin-top: 50px;

        input {
          padding: 0;
          color: #fff;
          background-color: var(--color);
          font-weight: 550;
          cursor: pointer;
          transition: 0.2s;
          font-size: 18px;
          letter-spacing: 5px;
          text-align: center;
          padding-left: 5px;

          &:hover {
            background-color: var(--color);
          }

          &:active {
            background-color: var(--clickh);
            border: 2px solid #FFF;
          }
        }
      }
    }
  }
}
</style>
