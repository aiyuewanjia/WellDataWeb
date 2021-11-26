<template>
  <el-card class="box-card">
    <!--头部-->
    <el-row :gutter="20">
      <el-col :span="8">
        <el-input placeholder="请输入包含的文字"></el-input>
      </el-col>
      <el-col :span="4">
        <el-button type="primary">搜索</el-button>
        <el-button type="success" @click="dialogVisible = true">添加</el-button>
      </el-col>
    </el-row>
    <!--添加用户模态窗口-->
    <el-dialog
      title="添加用户"
      v-model="dialogVisible"
      width="20%"
      :before-close="handleClose"
    >
      <div>
        <span class="lab">用户名称:</span>
        <el-input
          v-model="usermodel.UserName"
          placeholder="请输入用户名称"
        ></el-input>
        <span class="lab">用户密码:</span>
        <el-input
          v-model="usermodel.Password"
          placeholder="请输入用户密码"
        ></el-input>
        <span class="lab">用户角色:</span>
        <div>
          <el-select v-model="usermodel.Role" placeholder="请选择角色名称">
            <el-option
              v-for="item in selectrole"
              :key="item"
              :label="item"
              :value="item"
            >
            </el-option>
          </el-select>
        </div>
      </div>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="addUser">确 定</el-button>
        </span>
      </template>
    </el-dialog>
    <!--添加用户模态窗口结束-->
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
        <span class="lab">用户密码:</span>
        <el-input
          v-model="editUsermodel.NewPassword"
          placeholder="请输入用户密码"
        ></el-input>
        <span class="lab">用户角色:</span>
        <div>
          <el-select v-model="editUsermodel.Role" placeholder="请选择角色名称">
            <el-option
              v-for="item in selectrole"
              :key="item"
              :label="item"
              :value="item"
            >
            </el-option>
          </el-select>
        </div>
      </div>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="editUserVisible = false">取 消</el-button>
          <el-button type="primary" @click="editUser">确 定</el-button>
        </span>
      </template>
    </el-dialog>
    <!--编辑用户模态窗口结束-->
    <!--要放的东西-->
    <el-table :data="userData" style="width: 100%; font-size: 15px">
      <el-table-column prop="userId" label="用户id" width="360">
      </el-table-column>
      <el-table-column prop="userName" label="用户名称" width="180">
      </el-table-column>
      <el-table-column prop="userRole" label="用户角色"></el-table-column>
      <el-table-column label="编辑" width="200">
        <template v-slot="scoped">
          <el-button type="warning" @click="edit(scoped.row)">编辑</el-button>
          <el-button type="danger" @click="del(scoped.row.userName)"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <!--底部-->
    <div class="pagination">
      <el-pagination
        background
        layout="prev, pager, next"
        :total="totalcount"
        @current-change="currentChangeMethos"
      >
      </el-pagination>
    </div>
  </el-card>
</template>

<script>
export default {
  data() {
    return {
      dialogVisible: false,
      editUserVisible: false,
      userData: [],
      usermodel: {
        UserName: "",
        Password: "",
        Role: "",
      },
      editUsermodel: {
        UserName: "",
        NewPassword: "",
        Role: "",
      },
      selectrole: [],
      totalcount: 1,
    };
  },
  methods: {
    async currentChangeMethos(currentPage) {
      //获取分页数据
      this.getUserList(0, currentPage);
    },
    async addUser() {
      //添加用户的方法
      const { data: res } = await this.$http.post(
        "Authenticate/Register",
        this.usermodel
      );
      if (res.meta.status !== 200) {
        this.dialogVisible = false;
        return this.$message.error("添加失败！");
      }
      this.getUserList(1, 1);
      this.dialogVisible = false;
      return this.$message.success("添加成功！");
    },
    async getUserList(isInit, currentPage) {
      const { data: res } = await this.$http.get("Authenticate/GetUsers", {
        params: {
          page: currentPage,
        },
      });
      if (res.meta.status !== 200) return this.$message.error("获取失败！");
      this.userData = res.data;
      if (isInit) {
        this.totalcount = res.count;
      }
    },
    async getRoleList() {
      const { data: res } = await this.$http.get("Authenticate/GetRoles");
      this.selectrole = res;
    },
    edit(row) {
      this.editUsermodel.UserName = row.userName;
      this.editUsermodel.Role = row.userRole;
      this.editUserVisible = true;
    },
    async editUser() {
      const { data: res } = await this.$http.post(
        "Authenticate/ChangePasswordAndRole",
        this.editUsermodel
      );
      if (res.meta.status !== 200) {
        this.editUserVisible = false;
        return this.$message.error("修改失败！");
      }
      this.getUserList(1, 1);
      this.editUserVisible = false;
      return this.$message.success("修改成功！");
    },
    del(User) {
      this.$confirm("确认删除该用户,是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(async() => {
          await this.delUser(User);
        })
        .catch(() => {});
    },
    async delUser(User) {
      var params = new URLSearchParams();
      params.append("user", User);
      const { data: res } = await this.$http.post("Authenticate/DelUser", params);
      if (res.meta.status !== 200) {
        this.$message({
          message: '删除失败',
          type: 'error'
        });
      }
      this.getUserList(1, 1);
      this.$message({
          message: '删除成功',
          type: 'success'
        });
    },
  },
  created() {
    //获取用户列表
    this.getUserList(1, 1);
    //获取角色列表
    this.getRoleList();
  },
};
</script>

<style lang="less" scoped>
.pagination {
  width: 100%;
  text-align: center;
  position: absolute;
  bottom: 10px;
}
.box-card {
  position: relative;
  height: 100%;
}
.lab {
  display: inline-block;
  margin-top: 5px;
  margin-bottom: 5px;
  font-size: 16px;
  font-family: "Helvetica Neue";
  color: #606266;
}
</style>