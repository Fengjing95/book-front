<!--
 * @Date: 2020-10-10 08:48:10
 * @LastEditors: 小枫
 * @LastEditTime: 2020-10-10 19:20:21
 * @FilePath: \book\src\components\DailyAttendance.vue
-->
<template lang="pug">
  .daily-attendance
    el-dialog(
      :visible.sync="attendanceVisable",
      width="500px",
      close-on-click-modal=false,
      top="20vh",
    )
      daily-attendance-content(ref="contentRef")
</template>

<script>
import DailyAttendanceContent from './DailyAttendanceContent.vue';
  export default {
    data() {
      return {
        attendanceVisable: false
      }
    },
    components: {
      DailyAttendanceContent,
    },
    methods: {
      displayAttDialog() {
        this.attendanceVisable = true
      }
    },
    // 更新完成时执行，也就是窗口显示/隐藏时触发方法
    updated () {
      if(this.attendanceVisable) {
        this.$refs.contentRef.getAttendanceHistory()
      }
    },
  }
</script>

<style lang="less" scoped>

</style>
