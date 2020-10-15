<!--
 * @Date: 2020-10-15 09:22:54
 * @LastEditors: 小枫
 * @description: 动态组件
 * @LastEditTime: 2020-10-15 18:45:21
 * @FilePath: \book\src\components\Discussion\DynamicItem.vue
-->
<template lang="pug">
  div
    .dynamic-item
      el-avatar.dy-avatar(src="https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png", :size=50 )
      .dy-detail(class="clearfix")
        .nickname {{dynamicObj.username}}
        .dy-time {{dynamicObj.date | intervalTime}}
        .overflow(class="dy-content") {{dynamicObj.content}}
        .check-detail
          el-button(type="text",@click="$router.push(`/dynamic/${dynamicObj.id}`)") 查看详情
    .footer-btn
      .to-report(@click="toReport")
        i.el-icon-warning-outline 
        .btn-text 举报
      .review(@click="review")
        i.el-icon-chat-dot-round
        .btn-text {{0}}
      .give-like(:class="{active: isLike}", @click="giveLike")
        i.el-icon-sunny
        .btn-text {{1}}
</template>

<script>
// TODO：动态组件
  export default {
    props: {
      dynamicObj: Object
    },
    data() {
      return {
        isLike: true
      }
    },
    methods: {
      giveLike() {
        console.log('give like');
      },
      toReport() {
        console.log('to report');
      },
      review() {
        console.log('review');
      }
    },
  }
</script>

<style lang="less" scoped>
.dynamic-item {
  padding: 20px 20px 4px 20px;
  position: relative;
  text-align: left;
  background-color: #ffffff;
  .dy-avatar {
    float: left;
  }
  .dy-detail {
    margin-left: 60px;
    // clear: both;
    .nickname {
      margin-top: 8px;
      font-size: 14px;
      font-weight: 700;
    }
    .dy-time {
      margin-top: 10px;
      font-size: 12px;
      color: #777;
    }
    .dy-content {
      height: 100px;
      overflow: hidden;
    }
    .check-detail {
      text-align: center;
    }
  }
}
.footer-btn {
  border-top: solid 1px #c9c9c9;
  height: 30px;
  margin-bottom: 10px;
  background-color: #ffffff;
  display: flex;
  &:hover {
    cursor: pointer;
  }
  i {
    line-height: 30px;
    font-size: 20px;
  }
  .btn-text {
    display: inline-block;
    line-height: 20px;
    font-size: 14px;
    position: relative;
    top: -2.5px;
    right: -3px;
  }
  .to-report {
    flex: 1;
  }
  .review {
    flex: 1;
    border-left: solid 1px #c9c9c9;
    border-right: solid 1px #c9c9c9;
  }
  .give-like {
    flex: 1;
  }
  .active {
    color: #409eff;
  }
}
.clearfix {
  &::after {
    content: '';
    clear: both;
    visibility: hidden;
  }
}
.overflow {
  position: relative;
  &::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 70px;
    background: linear-gradient(rgba(255, 255, 255, 0),white); /* 溢出部分那显示渐变 */
    pointer-events: none;
  }
}
</style>