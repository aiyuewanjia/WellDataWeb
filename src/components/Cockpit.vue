<template>
  <dv-border-box-11 title="井室系统">
    <div class="content">
      <div class="row1">时间：{{ d }}</div>
      <div class="row2">
        <div class="row2colum1">
          <h1>井室数量</h1>
          <dv-decoration-9 style="width: 150px; height: 150px"
            >2</dv-decoration-9
          >
        </div>
        <div class="row2colum2">
          <h1>当前报警数</h1>
          <dv-decoration-9 style="width: 150px; height: 150px"
            >2</dv-decoration-9
          >
        </div>
      </div>
      <div class="row3">
        <div class="row3colum1">
          <h1>排名前5井室</h1>
          <dv-capsule-chart
            :config="config"
            style="width: 100%; height: 200px"
          />
        </div>
        <!--
        <div class="row3colum2">
          <dv-active-ring-chart
            :config="config1"
            style="width: 300px; height: 300px"
          />
        </div>
        <div class="row3colum3">
          <dv-scroll-board
            :config="config3"
            style="width: 100%; height: 300px"
          />
        </div>
        -->
      </div>
    </div>
  </dv-border-box-11>
</template>

<script>
export default {
  data() {
    return {
      config: {
        data: [
          {
            name: "1#",
            value: 167,
          },
          {
            name: "2#",
            value: 67,
          },
          {
            name: "3#",
            value: 123,
          },
          {
            name: "4#",
            value: 55,
          },
          {
            name: "5#",
            value: 98,
          }
        ]      
      },
      date: new Date(),
      d:"",
      config1: {
        data: [
          {
            name: "周口",
            value: 55,
          },
          {
            name: "南阳",
            value: 120,
          },
          {
            name: "西峡",
            value: 78,
          },
          {
            name: "驻马店",
            value: 66,
          },
          {
            name: "新乡",
            value: 80,
          },
        ],
      },
      config3: {
        header: ["列1", "列2", "列3"],
        data: [
          ["行1列1", "行1列2", "行1列3"],
          ["行2列1", "行2列2", "行2列3"],
          ["行3列1", "行3列2", "行3列3"],
          ["行4列1", "行4列2", "行4列3"],
          ["行5列1", "行5列2", "行5列3"],
          ["行6列1", "行6列2", "行6列3"],
          ["行7列1", "行7列2", "行7列3"],
          ["行8列1", "行8列2", "行8列3"],
          ["行9列1", "行9列2", "行9列3"],
          ["行10列1", "行10列2", "行10列3"],
        ],
      },
    };
  },
  methods: {
    dateFormat(time) {
      var date = new Date(time);
      var year = date.getFullYear();
      /* 在日期格式中，月份是从0开始的，因此要加0
       * 使用三元表达式在小于10的前面加0，以达到格式统一  如 09:11:05
       * */
      var month =
        date.getMonth() + 1 < 10
          ? "0" + (date.getMonth() + 1)
          : date.getMonth() + 1;
      var day = date.getDate() < 10 ? "0" + date.getDate() : date.getDate();
      var hours =
        date.getHours() < 10 ? "0" + date.getHours() : date.getHours();
      var minutes =
        date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes();
      var seconds =
        date.getSeconds() < 10 ? "0" + date.getSeconds() : date.getSeconds();
      // 拼接
      return (
        year +
        "-" +
        month +
        "-" +
        day +
        " " +
        hours +
        ":" +
        minutes +
        ":" +
        seconds
      );
    },
  },
  mounted() {
    //显示当前日期时间
    this.timer = setInterval(() => {
      this.date = new Date(); // 修改数据date
      this.d = this.dateFormat(this.date);
    }, 1000);
  },
  beforeUnmount() {
    if (this.timer) {
      clearInterval(this.timer); // 在Vue实例销毁前，清除我们的定时器
    }
  },
};
</script>

<style lang="less" scoped>
.dv-border-box-11 {
  background-color: #282c34;
  .content {
    padding: 40px;
    .row1 {
      height: 80px;
      font-size: 20px;
      color: aliceblue;
      text-align: left;
    }
    .row2 {
      margin: auto;
      width: 500px;
      text-align: center;
      color: aliceblue;
      .dv-decoration-9 {
        margin: auto;
        color: #7bb997;
        font-size: 28px;
      }
      .row2colum1 {
        display: inline-block;
        width: 250px;
      }
      .row2colum2 {
        display: inline-block;
        width: 250px;
      }
    }
    .row3 {
      margin-top: 20px;
      .row3colum1 {
        text-align: center;
        float: left;
        color: aliceblue;
        width: 25%;
      }
      .row3colum2 {
        float: left;
        width: 50%;
        .dv-active-ring-chart {
          margin: auto;
        }
      }
      .row3colum3 {
        float: left;
        width: 25%;
      }
    }
  }
}
</style>
