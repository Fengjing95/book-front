<!--
 * @Date: 2020-10-10 09:25:43
 * @LastEditors: 小枫
 * @LastEditTime: 2020-10-12 09:18:50
 * @FilePath: \book\src\components\Attendance\DailyAttendanceContent.vue
-->
<template lang="pug">
  .attendance-content
    .line1
      .line1-box(
        v-for="item in line1",
        :key="item.count",
        :class="{done: item.count <= attendanceInfo.attendanceTimes}"
      ) {{item.day}}
        el-tooltip(
          effect="dark",
          :content="`签到奖励源币: ${item.coin}`",
          placement="top",
          :open-delay="openDelay"
        )
          .line-box-img
        span {{item.coin}}
    .line2
      .line2-box(
        v-for="item in line2",
        :key="item.count",
        :class="{done: item.count <= attendanceInfo.attendanceTimes}"
      ) {{item.day}}
        el-tooltip(
          effect="dark",
          :content="`签到奖励源币: ${item.coin}`",
          placement="bottom",
          :open-delay="openDelay"
        )
          .line-box-img
        span {{item.coin}}
    el-button.att-btn(
      type="primary",
      @click="signIn",
      :disabled="attendanceInfo.attendanceDate",
      style="width: 150px"
      round
    )
      i.el-icon-date {{attendanceInfo.attendanceDate ? ' 已签到' : ' 签到'}}
</template>

<script>
  export default {
    data() {
      return {
        attenTimes: null,
        line1: [
          {count: 1, day: '第一天', coin: 100},
          {count: 2, day: '第二天', coin: 200},
          {count: 3, day: '第三天', coin: 400},
          {count: 4, day: '第四天', coin: 400},
        ],
        line2: [
          {count: 5, day: '第五天', coin: 500},
          {count: 6, day: '第六天', coin: 500},
          {count: 7, day: '第七天', coin: 1000},
        ],
        attendanceInfo: {
          attendanceDate: false,
          attendanceTimes: 0
        },
        openDelay: 500
      }
    },
    methods: {
      getAttendanceHistory() {
        this.$http.get('/attendance/getattendance').then(
          res => {
            if(res) {
              // console.log(res.data.obj);
              this.attendanceInfo = res.data.obj
            }
          }
        )
      },
      signIn() {
        this.$http.get('/attendance/attendance').then(
          res => {
            if(res) {
              // console.log(res);
              this.$message.success('签到成功')
              this.attendanceInfo = res.data.obj
            }
          }
        )
      },
    },
  }
</script>

<style lang="less" scoped>
.attendance-content {
  .line1 {
    display: flex;
    .line1-box {
      flex: 1;
      margin: 0 9px;
      padding: 10px;
      position: relative;
      border: solid 1px #f5f5f5;
      box-shadow: 5px 10px 10px #f5f5f5;
      border-radius: 15px;
      span {
        position: absolute;
        bottom: 10px;
        right: 10px;
      }
    }
  }
  .line-box-img {
    height: 75px;
    background: url('../../assets/image/coin.png') no-repeat center 0px;
    background-position: center 0px;
    background-size: cover;
  }
  .line2 {
    display: flex;
    margin-top: 20px;
    .line2-box {
      flex: 1;
      margin: 0 28px;
      padding: 10px;
      box-shadow: 5px 10px 10px #f5f5f5;
      border: solid 1px #f5f5f5;
      border-radius: 15px;
      position: relative;
      span {
        position: absolute;
        bottom: 10px;
        right: 10px;
      }
    }
  }
  .done {
    &::after {
      content: '已签到';
      color: red;
      position: absolute;
      border: red solid 3px;
      border-radius: 20px;
      font-size: 10px;
      transform: translate(-43px, -23px) rotate(30deg);
    }
  }
  .att-btn {
    margin-top: 20px;
  }
}
</style>
