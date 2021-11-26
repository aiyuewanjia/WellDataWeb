<template>
  <el-card class="box-card">
    <!--头部-->
    <el-row :gutter="20">
      <el-col :span="8">
        <el-input placeholder="请输入包含的文字"></el-input>
      </el-col>
      <el-col :span="4">
        <el-button type="primary">搜索</el-button>
      </el-col>
    </el-row>
    <!--要放的东西-->
    <el-table :data="tableData" style="width: 100%; font-size: 15px">
      <el-table-column prop="time" label="时间" width="180"> </el-table-column>
      <el-table-column prop="wellName" label="井室名称" width="180">
      </el-table-column>
      <el-table-column prop="address" label="地址"> </el-table-column>
      <el-table-column label="偏移" width="800">
        <template v-slot="scoped">
          <ruler :offset="scoped.row.offsetValue"></ruler>
        </template>
      </el-table-column>
      <el-table-column prop="offset" label="偏移值" width="100">
      </el-table-column>
      <el-table-column prop="temperature" label="温度" width="100">
      </el-table-column>
      <el-table-column label="泄露报警" width="100">
        <template v-slot="scoped">
          <el-switch
            v-model="scoped.row.isAlarm"
            active-color="#ff0000"
            disabled
          ></el-switch>
        </template>
      </el-table-column>
    </el-table>
    <!--底部-->
    <div class="pagination">
      <el-pagination background layout="prev, pager, next" 
      :total="totalcount" 
      @current-change="currentChangeMethos">
      </el-pagination>
    </div>
  </el-card>
</template>
<script>
import ruler from "./Ruler";
export default {
  data() {
    return {
      tableData: [],
      totalcount: 10
    };
  },
  components: {
    ruler,
  },
  methods: {
    async getdata(num,isCount) {
        const { data: res } = await this.$http.get("Well/GetCurrentWellDatas",{
          params:{
            page:num
          }
        });
        if (res.meta.status !== 200) return this.$message.error("获取失败！");
        this.tableData = res.data;
        if (isCount == 1) {this.totalcount = res.count}
    },  
    async currentChangeMethos(currentPage){
        this.getdata(currentPage,0);
    }
  },
  created() {
    this.getdata(1,1);
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
</style>