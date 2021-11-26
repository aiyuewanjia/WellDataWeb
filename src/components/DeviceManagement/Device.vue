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
    <!--模态窗口-->
    <el-dialog
      title="添加设备"
      v-model="dialogVisible"
      width="20%"
      :before-close="handleClose"
    >
      <div>
        <span class="lab">设备序列号:</span>
        <el-input
          v-model="devicemodel.imei"
          placeholder="请输入序列号"
        ></el-input>
        <span class="lab">设备名称:</span>
        <el-input
          v-model="devicemodel.name"
          placeholder="请输入名称"
        ></el-input>
        <span class="lab">设备地址:</span>
        <el-input
          v-model="devicemodel.address"
          placeholder="请输入地址"
        ></el-input>
        <span class="lab">原点值:</span>
        <el-input
          v-model="devicemodel.originValue"
          placeholder="请输入原点值"
        ></el-input>
      </div>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="adddevice">确 定</el-button>
        </span>
      </template>
    </el-dialog>
    <!--模态窗口结束-->
    <!--模态窗口-->
    <el-dialog
      title="编辑设备"
      v-model="updatedialogVisible"
      width="20%"
      :before-close="handleClose"
    >
      <div>
        <span class="lab">设备id:</span>
        <el-input
          v-model="deviceUpdateModel.id"
          placeholder="请输入id"
        ></el-input>
        <span class="lab">设备序列号:</span>
        <el-input
          v-model="deviceUpdateModel.imei"
          placeholder="请输入序列号"
        ></el-input>
        <span class="lab">设备名称:</span>
        <el-input
          v-model="deviceUpdateModel.name"
          placeholder="请输入名称"
        ></el-input>
        <span class="lab">设备地址:</span>
        <el-input
          v-model="deviceUpdateModel.address"
          placeholder="请输入地址"
        ></el-input>
        <span class="lab">原点值:</span>
        <el-input
          v-model="deviceUpdateModel.originValue"
          placeholder="请输原点值"
        ></el-input>
      </div>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="updatedialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="updatedevice">确 定</el-button>
        </span>
      </template>
    </el-dialog>
    <!--模态窗口结束-->
    <!--要放的东西-->
    <el-table :data="deviceData" style="width: 100%; font-size: 15px">
      <el-table-column prop="id" label="设备id" width="360"> </el-table-column>
      <el-table-column prop="imei" label="设备序列号" width="180">
      </el-table-column>
      <el-table-column prop="name" label="设备名称" width="200">
      </el-table-column>
      <el-table-column prop="address" label="地址"></el-table-column>
      <el-table-column prop="originValue" label="原点值" width="100"></el-table-column>
      <el-table-column label="编辑" width="200">
        <template v-slot="scoped">
          <el-button type="warning" @click="edit(scoped.row)">编辑</el-button>
            <el-button type="danger" @click="del(scoped.row.id)"
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
      updatedialogVisible: false,
      devicemodel: {
        imei: "",
        name: "",
        address: "",
        originValue:""
      },
      deviceUpdateModel: {
        id: "",
        imei: "",
        name: "",
        address: "",
        originValue:""
      },
      num: "",
      deviceData: [],
      totalcount: 1,
    };
  },
  methods: {
    edit(row) {
      this.deviceUpdateModel.id = row.id;
      this.deviceUpdateModel.imei = row.imei;
      this.deviceUpdateModel.name = row.name;
      this.deviceUpdateModel.address = row.address;
      this.deviceUpdateModel.originValue = row.originValue;
      this.updatedialogVisible = true;
    },
    async del(id){
      this.$confirm("确认删除该设备,是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(async() => {
          await this.delDevice(id);
        })
        .catch(() => {});
    },
    async delDevice(id) {
      var params = new URLSearchParams();
      params.append("id", id);
      const { data: res } = await this.$http.post("Well/DelDevice", params);
      if (res.meta.status !== 200) {
        return this.$message.error(res.meta.msg);
      }
      this.getdevicedata(1, 1);
      this.$message.success("删除成功！");
    },
    async updatedevice() {
      const { data: res } = await this.$http.post(
        "Well/UpdateDevice",
        this.deviceUpdateModel
      );
      if (res.meta.status !== 200) {
        this.updatedialogVisible = false;
        return this.$message.error(res.meta.msg);
      }
      this.getdevicedata(1, 1);
      this.$message.success("更新成功！");
      this.updatedialogVisible = false;
    },
    async getdevicedata(isInit, currentPage) {
      const { data: res } = await this.$http.get("Well/GetDevices", {
        params: {
          page: currentPage,
        },
      });
      if (res.meta.status !== 200) return this.$message.error("获取失败！");
      this.deviceData = res.data;
      if (isInit) {
        this.totalcount = res.count;
      }
    },
    async adddevice() {
      const { data: res } = await this.$http.post(
        "Well/AddDevice",
        this.devicemodel
      );
      if (res.meta.status !== 200) {
        this.dialogVisible = false;
        return this.$message.error(res.meta.msg);
      }
      this.getdevicedata(1, 1);
      this.$message.success("添加成功！");
      this.dialogVisible = false;
    },
    async currentChangeMethos(currentPage) {
      this.getdevicedata(0, currentPage);
    },
  },
  created() {
    this.getdevicedata(1, 1);
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