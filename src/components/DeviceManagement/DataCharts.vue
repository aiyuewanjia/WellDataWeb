<template>
  <div class="box-card">
    <div class="row1">
      <span class="lab">时间范围</span>
      <el-date-picker
        v-model="time"
        type="datetimerange"
        :shortcuts="shortcuts"
        :default-time="defaultTime"
        range-separator="至"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
      >
      </el-date-picker>
      <el-button @click="dialogVisible = true">选择点位</el-button>
      <el-dialog
        title="选择查询点位"
        v-model="dialogVisible"
        width="20%"
        :before-close="handleClose"
      >
        <div>
          <el-select v-model="wellname" placeholder="请选择设备名称">
            <el-option
              v-for="item in select"
              :key="item"
              :label="item"
              :value="item"
            >
            </el-option>
          </el-select>
        </div>
        <el-checkbox
          :indeterminate="isIndeterminate"
          v-model="checkAll"
          @change="handleCheckAllChange"
          >全选</el-checkbox
        >
        <div style="margin: 15px 0"></div>
        <el-checkbox-group
          v-model="checkedPoint"
          @change="handleCheckedPointsChange"
        >
          <el-checkbox v-for="point in points" :label="point" :key="point">{{
            point
          }}</el-checkbox>
        </el-checkbox-group>
        <template #footer>
          <span class="dialog-footer">
            <el-button @click="dialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="dialogVisible = false"
              >确 定</el-button
            >
          </span>
        </template>
      </el-dialog>
      <el-button type="primary" @click="queryMethos">查询数据</el-button>
      <el-divider></el-divider>
    </div>
    <div id="container" :key="random"></div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      request: {
        StartTime: "",
        StopTime: "",
        WellName: "",
        Point: "",
      },
      random: 1,
      dialogVisible: false,
      wellname: "",
      checkAll: false,
      checkedPoint: [],
      pointOptions: ["温度", "偏移量", "报警"],
      points: ["温度", "偏移量", "报警"],
      isIndeterminate: true,
      select: [],
      options: {},
      shortcuts: [
        {
          text: "今天",
          value: new Date(),
        },
        {
          text: "昨天",
          value: () => {
            const date = new Date();
            date.setTime(date.getTime() - 3600 * 1000 * 24);
            return date;
          },
        },
        {
          text: "一周前",
          value: () => {
            const date = new Date();
            date.setTime(date.getTime() - 3600 * 1000 * 24 * 7);
            return date;
          },
        },
      ],
      time: "",
      defaultTime: [
        new Date(2000, 1, 1, 0, 0, 0),
        new Date(2000, 2, 1, 23, 59, 59),
      ], // '00:00:00', '23:59:59'
    };
  },
  methods: {
    Mychart(num) {
      let mychart;
      if (mychart != null && mychart != "" && mychart != undefined) {
        mychart.dispose();
      }
      mychart = this.$echarts.init(document.getElementById("container"));
      let option = {
        tooltip: {
          trigger: "axis",
          position: function (pt) {
            return [pt[0], "10%"];
          },
        },
        title: {
          left: "center",
          text: "历史数据",
        },
        toolbox: {
          feature: {
            dataZoom: {
              yAxisIndex: "none",
            },
            restore: {},
            saveAsImage: {},
          },
        },
        xAxis: {
          type: "category",
          boundaryGap: false,
          data: [],
        },
        yAxis: {
          type: "value",
          boundaryGap: [0, "100%"],
        },
        dataZoom: [
          {
            type: "inside",
            start: 0,
            end: 100,
          },
          {
            start: 0,
            end: 100,
          },
        ],
        series: [],
      };
      if (num == 1) {
        for (let i = 0; i < this.options.series.length; i++) {
          let s = new Object();
          s.serie = {
            name: "",
            type: "line",
            symbol: "none",
            sampling: "lttb",
            itemStyle: {
              color: "",
            },
            areaStyle: {
              color: {},
            },
            data: [],
          };
          s.serie.itemStyle.color = this.options.series[i].borderColor;
          s.serie.areaStyle.color = new this.$echarts.graphic.LinearGradient(
            0,
            0,
            0,
            1,
            [
              {
                offset: 0,
                color: this.options.series[i].color,
              },
              {
                offset: 1,
                color: this.options.series[i].borderColor,
              },
            ]
          );
          s.serie.name = this.options.series[i].name;
          s.serie.data = this.options.series[i].data;
          option.series.push(s.serie);
        }
        option.xAxis.data = this.options.xAxis;
      }
      mychart.setOption(option, true);
      this.$forceUpdate();
    },
    async getChartsData() {
      this.$refs.loginFormRef.validate(async (valid) => {
        if (!valid) return;
        const { data: res } = await this.$http.get(
          "Well/GetHistoryWellDatas",
          this.request
        );
        if (res.meta.status !== 200)
          return this.$message.error("获取数据失败！");
        this.options = res.option;
      });
    },
    async queryMethos() {
      if (this.time == "") return this.$message.error("时间不能为空！");
      if (this.WellName == "" || this.checkedPoint.toString() == "")
        return this.$message.error("查询参数不能为空！");
      this.request.StartTime = this.time[0];
      this.request.StopTime = this.time[1];
      this.request.WellName = this.wellname;
      this.request.Point = this.checkedPoint.toString();
      const { data: res } = await this.$http.get("Well/GetHistoryWellDatas", {
        params: this.request,
      });
      this.options = res.option;
      this.Mychart(1);
    },
    handleCheckAllChange(val) {
      this.checkedPoint = val ? this.pointOptions : [];
      this.isIndeterminate = false;
    },
    handleCheckedPointsChange(value) {
      let checkedCount = value.length;
      this.checkAll = checkedCount === this.points.length;
      this.isIndeterminate =
        checkedCount > 0 && checkedCount < this.points.length;
    },
    async getDeviceData() {
      //获取设备数据
      const { data: res } = await this.$http.get("Well/GetDevices");
      var result = res.data;
      for (var i = 0; i < result.length; i++) {
        this.select.push(result[i].name);
      }
    },
  },
  created() {
    this.getDeviceData();
    this.random = Math.random();
  },
  mounted() {
    this.Mychart(0);
  },
  unmounted() {},
};
</script>
}
<style lang="less" scoped>
#container {
  height: calc(100% - 180px);
  width: 100%;
}
.lab {
  display: inline-block;
  margin-left: 50px;
  margin-right: 50px;
  font-family: "Helvetica Neue";
  color: #606266;
}
.el-button {
  margin-left: 20px;
  margin-right: 20px;
}
.el-select {
  margin-bottom: 10px;
}
.box-card {
  position: relative;
  background-color: #fefefe;
  height: 100%;
  //*
  padding: 20px;
  border-radius: 4px;
  height: 100%;
  //*/
}
</style>