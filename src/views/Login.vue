<template>
  <div class="login_container">
    <div class="login_box">
      <h1>井室管理系统</h1>
      <!-- 登录表单区域 -->
      <el-form
        ref="loginFormRef"
        :model="loginForm"
        :rules="loginFormRules"
        label-width="0px"
        class="login_form"
      >
        <div class="inputbox">
          <!-- 用户名 -->
          <el-form-item prop="username">
            <el-input
              v-model="loginForm.username"
              prefix-icon="el-icon-user"
            ></el-input>
          </el-form-item>
          <!-- 密码 -->
          <el-form-item prop="password">
            <el-input
              v-model="loginForm.password"
              prefix-icon="el-icon-lock"
              type="password"
            ></el-input>
          </el-form-item>
        </div>

        <!-- 按钮区域 -->
        <el-form-item class="btns">
          <div>
            <el-button type="primary" @click="login">登录</el-button>
          </div>
          <div>
            <el-button type="info" @click="resetLoginForm">重置</el-button>
          </div>
          <el-checkbox v-model="remember">记住密码</el-checkbox>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      // 这是登录表单的数据绑定对象
      loginForm: {
        username: "",
        password: "",
      },
      remember: false,
      // 这是表单的验证规则对象
      loginFormRules: {
        // 验证用户名是否合法
        username: [
          { required: true, message: "请输入登录名称", trigger: "blur" },
          {
            min: 3,
            max: 15,
            message: "长度在 3 到 15 个字符",
            trigger: "blur",
          },
        ],
        // 验证密码是否合法
        password: [
          { required: true, message: "请输入登录密码", trigger: "blur" },
          {
            min: 6,
            max: 15,
            message: "长度在 6 到 15 个字符",
            trigger: "blur",
          },
        ],
      },
    };
  },
  methods: {
    // 点击重置按钮，重置登录表单
    resetLoginForm() {
      // console.log(this);
      this.$refs.loginFormRef.resetFields();
    },
    login() {
      this.setUserInfo();
      this.$refs.loginFormRef.validate(async (valid) => {
        if (!valid) return;
        const { data: res } = await this.$http.post(
          "Authenticate/Login",
          this.loginForm
        );
        if (res.meta.status !== 200) return this.$message.error("登录失败！");
        this.$message.success("登录成功");
        // 1. 将登录成功之后的 token，保存到客户端的 sessionStorage 中
        //   1.1 项目中出了登录之外的其他API接口，必须在登录之后才能访问
        //   1.2 token 只应在当前网站打开期间生效，所以将 token 保存在 sessionStorage 中
        window.sessionStorage.setItem("token", res.data.token);
        window.sessionStorage.setItem("user", res.data.userName);
        window.sessionStorage.setItem("role", res.data.userRole);
        // 2. 通过编程式导航跳转到后台主页，路由地址是 /home //background-color: #2b4b6b;
        //this.$router.push("/cockpit");
        this.$router.push({
          path: "/cockpit",
          params: {
            role: res.data.userrole,
          },
        });
      });
    },
    // 储存表单信息
    setUserInfo: function () {
      // 判断用户是否勾选记住密码，如果勾选，向cookie中储存登录信息，
      // 如果没有勾选，储存的信息为空
      if (this.remember) {
        this.setCookie("account", this.loginForm.username, 7);
        // base64加密密码
        let passWord = this.loginForm.password;
        this.setCookie("password", passWord, 7);
      } else {
        this.setCookie("account", "");
        this.setCookie("password", "");
      }
    },
    // 获取cookie
    getCookie: function (key) {
      if (document.cookie.length > 0) {
        var start = document.cookie.indexOf(key + "=");
        if (start !== -1) {
          start = start + key.length + 1;
          var end = document.cookie.indexOf(";", start);
          if (end === -1) end = document.cookie.length;
          return unescape(document.cookie.substring(start, end));
        }
      }
      return "";
    },
    // 保存cookie
    setCookie: function (cName, value, expiredays) {
      var exdate = new Date();
      exdate.setDate(exdate.getDate() + expiredays);
      document.cookie =
        cName +
        "=" +
        decodeURIComponent(value) +
        (expiredays == null ? "" : ";expires=" + exdate.toGMTString());
    },
  },
  created() {
    // 在页面加载时从cookie获取登录信息
    let account = this.getCookie("account");
    let password = this.getCookie("password");
    // 如果存在赋值给表单，并且将记住密码勾选
    if (account) {
      this.loginForm.username = account;
      this.loginForm.password = password;
      this.remember = true;
    }
  },
};
</script>

<style lang="less" scoped>
.login_container {
  background: url("../assets/image/背景.jpg");
  background-repeat: no-repeat;
  background-position: 0px 0px;
  height: 100%;
}

.login_box {
  text-align: center;
  width: 500px;
  height: 400px;
  background-image: linear-gradient(
    to top,
    #0c3483 0%,
    #a2b6df 100%,
    #6b8cce 100%,
    #a2b6df 100%
  );
  border-radius: 3px;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  color: #fff;
  .el-button {
    width: 300px;
    margin-bottom: 10px;
  }
  .inputbox {
    width: 350px;
    margin: auto;
  }
  .avatar_box {
    height: 130px;
    width: 130px;
    border: 1px solid #eee;
    border-radius: 50%;
    padding: 10px;
    box-shadow: 0 0 10px #ddd;
    position: absolute;
    left: 50%;
    transform: translate(-50%, -50%);
    background-color: #fff;
    img {
      width: 100%;
      height: 100%;
      border-radius: 50%;
      background-color: #eee;
    }
  }
}

.login_form {
  position: absolute;
  bottom: 0;
  width: 100%;
  padding: 0 20px;
  box-sizing: border-box;
}

.btns {
  display: flex;
  justify-content: flex-end;
}
</style>
