<template>
  <el-container class="home-container">
    <!-- 头部区域 -->
    <el-header>
      <div>
        <span>井室管理系统</span>
      </div>   
      <div>
        <img class="headimg" src="../assets/image/avatar.jpg"/>
      <el-dropdown>
        <span class="el-dropdown-link"> {{ username }} </span>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item icon="el-icon-edit" @click="edit">密码设置</el-dropdown-item>
            <el-dropdown-item icon="el-icon-switch-button" @click="logout">退出系统</el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
      </div>
    </el-header>
     <!--编辑用户模态窗口-->
    <el-dialog
      title="编辑用户"
      v-model="editUserVisible"
      width="20%"
      :before-close="handleClose"
    >
      <div>
        <span class="lab">用户名称:</span>
        <el-input
          v-model="editUsermodel.UserName"
          placeholder="用户名称"
          :disabled="true"
        ></el-input>
        <span class="lab">用户新密码:</span>
        <el-input
          v-model="editUsermodel.NewPassword"
          placeholder="请输入用户密码"
        ></el-input>  
      </div>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="editUserVisible = false">取 消</el-button>
          <el-button type="primary" @click="editUser">确 定</el-button>
        </span>
      </template>
    </el-dialog>
    <!--编辑用户模态窗口结束-->
    <!-- 页面主体区域 -->
    <el-container>
      <!-- 侧边栏 -->
      <el-aside :width="isCollapse ? '64px' : '200px'">
        <div class="toggle-button" @click="toggleCollapse">
          <span>
            <i v-if="isCollapse" class="el-icon-arrow-right" />
            <i v-if="!isCollapse" class="el-icon-arrow-left" />
          </span>
        </div>
        <!-- 侧边栏菜单区域 -->
        <el-menu
          background-color="#333744"
          text-color="#fff"
          active-text-color="#409EFF"
          unique-opened
          :collapse="isCollapse"
          :collapse-transition="false"
          router
          :default-active="activePath"
        >
          <el-menu-item index="/cockpit" @click="isCollapse = true">
            <i class="el-icon-aim"></i>
            <template #title>驾驶舱</template>
          </el-menu-item>
          <el-menu-item index="/welldata">
            <i class="el-icon-menu"></i>
            <template #title>井室数据</template>
          </el-menu-item>
          <el-submenu index="3">
            <template #title>
              <i class="el-icon-location"></i>
              <span>设备管理</span>
            </template>
            <el-menu-item index="/device" v-if="userrole === 'Admin'">
              <i class="el-icon-odometer"></i>
              <template #title>设备</template>
            </el-menu-item>
            <el-menu-item index="/datacharts">
              <i class="el-icon-set-up"></i>
              <template #title>历史数据</template>
            </el-menu-item>
          </el-submenu>
          <el-menu-item index="/user" v-if="userrole === 'Admin'">
            <i class="el-icon-user"></i>
            <template #title>用户管理</template>
          </el-menu-item>
        </el-menu>
      </el-aside>
      <!-- 右侧内容主体 -->
      <el-main>
        <!-- 路由占位符 -->
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  data() {
    return {
      // 是否折叠
      isCollapse: false,
      // 被激活的链接地址
      activePath: "",
      username:"",
      userrole:"",
      editUserVisible:false,
      editUsermodel: {
        UserName: "",
        NewPassword: ""
      }
    };
  },
  created() {
    //this.getMenuList();
    this.activePath = window.sessionStorage.getItem("activePath");
    this.username = window.sessionStorage.getItem("user");
    this.userrole = window.sessionStorage.getItem("role");
  },
  methods: {
    logout() {
      window.sessionStorage.clear();
      this.$router.push("/login");
    },
    // 获取所有的菜单
    async getMenuList() {
      /*
      const { data: res } = await this.$http.get("menus");
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg);
      this.menulist = res.data;
      console.log(res);
      */
    },
    // 点击按钮，切换菜单的折叠与展开
    toggleCollapse() {
      this.isCollapse = !this.isCollapse;
    },
    // 保存链接的激活状态
    saveNavState(activePath) {
      window.sessionStorage.setItem("activePath", activePath);
      this.activePath = activePath;
    },
    edit(){
      this.editUsermodel.UserName = this.username;
      this.editUserVisible = true;
    },
    async editUser() {
      const { data: res } = await this.$http.post(
        "Authenticate/ChangePassword",
        this.editUsermodel
      );
      if (res.meta.status !== 200) {
        this.editUserVisible = false;
        return this.$message.error("修改失败！");
      }
      this.editUserVisible = false;
      return this.$message.success("修改成功！");
    }
  },
};
</script>

<style lang="less" scoped>
.home-container {
  height: 100%;
}
.el-header {
  background-color: #373d41;
  display: flex;
  justify-content: space-between;
  padding-left: 0;
  align-items: center;
  color: #fff;
  font-size: 24px;
  > div {
    display: flex;
    align-items: center;
    span {
      margin-left: 30px;
    }
  }
}
.el-dropdown {
  .span {
    margin-bottom: 15px;
  }
}

.headimg {
  width: 30px;
  height: 30px;
  border-radius: 50%;
}
.el-aside {
  background-color: #333744;
  .el-menu {
    border-right: none;
  }
}

.el-main {
  background-color: #282c34;
  overflow: hidden;
}

.iconfont {
  margin-right: 10px;
}

.el-dropdown-link {
  font-size: 16px;
  color:#fff;
  margin-right: 20px;
}

.toggle-button {
  background-color: #4a5064;
  font-size: 10px;
  line-height: 24px;
  color: #fff;
  text-align: center;
  letter-spacing: 0.2em;
  cursor: pointer;
  .span {
    height: 100%;
  }
}
</style>
