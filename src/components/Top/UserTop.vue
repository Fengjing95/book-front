<!--
 * @Date: 2020-11-13 20:24:57
 * @LastEditors: 小枫
 * @description: 用户排行榜组件
 * @LastEditTime: 2020-11-14 21:14:01
 * @FilePath: \book\src\components\Top\UserTop.vue
-->
<template lang="pug">
  .user-top 
    h2 资源大佬
    .top
      .top-left
        div(v-for="item in second", :key="item.topId")
          el-avatar(:src="$photoHeader+item.user.image" :size="80")
          h4 {{item.user.userName}}
          p 上传资源数： {{item.topCount}}
          .medals
      .top-center
        div(v-for="item in first", :key="item.topId")
          el-avatar(:src="$photoHeader+item.user.image" :size="80")
          h4 {{item.user.userName}}
          p 上传资源数： {{item.topCount}}
          .medals
      .top-right
        div(v-for="item in third", :key="item.topId")
          el-avatar(:src="$photoHeader+item.user.image" :size="80")
          h4 {{item.user.userName}}
          p 上传资源数： {{item.topCount}}
          .medals
        div(v-if="third.length === 0")  宝座空闲
    .bottom(v-if="userList.length> 3")
      .title 他们也很棒
      .list
        .user-item(v-for="item in other", :key="item.topId")
          el-tooltip(:content="`累计上传:${item.topCount}`" placement="top", :open-delay="500")
            el-avatar(:src="$photoHeader+item.user.image" :size="50")
          .user-name {{item.user.userName}}
</template>

<script>
  export default {
    props: {
      userList: Array
    },
    computed: {
      other() {
        return this.userList.slice(3) 
      },
      first() {
        return this.userList.slice(0, 1) 
      },
      second() {
        return this.userList.slice(1, 2) 
      },
      third() {
        return this.userList.slice(2, 3) 
      },
    },
  }
</script>

<style lang="less" scoped>
.user-top {
  background-color: #fff;
  width: 1000px;
  margin: 0 auto;
  padding-top: 15px;
  .top {
    display: flex;
    height: 292px;
    margin-top: 10px;
    border-top: solid 1px #f0f0f0;
    border-bottom: solid 1px #f0f0f0;
    p {
      color: #777;
      font-size: 14px;
    }
    .top-left {
      padding-top: 50px;
      flex: 1;
      position: relative;
      .medals {
        background: url('../../assets/svg/star.svg') no-repeat;
        width: 32px;
        height: 32px;
        position: absolute;
        top: 105px;
        right: 125px;
      }
    }
    .top-center {
      flex: 1;
      border-left: solid 1px #f0f0f0;
      border-right: solid 1px #f0f0f0;
      padding-top: 30px;
      position: relative;
      .medals {
        background: url('../../assets/svg/sun.svg') no-repeat;
        width: 32px;
        height: 32px;
        position: absolute;
        top: 85px;
        right: 125px;
      }
    }
    .top-right {
      flex: 1;
      padding-top: 50px;
      position: relative;
      .medals {
        background: url('../../assets/svg/star.svg') no-repeat;
        width: 32px;
        height: 32px;
        position: absolute;
        top: 105px;
        right: 125px;
      }
    }
  }
  .bottom {
    padding: 20px;
    .title {
      margin: 0 auto;
      background: url('../../assets/svg/titlebg.svg') no-repeat;
      background-size: cover;
      width: 154px;
      height: 29px;
      color: #fff;
      font-size: 15px;
      line-height: 27px;
    }
    .list {
      margin-top: 20px;
      display: flex;
      .user-item {
        flex: 1;
      }
    }
  }
}
</style>