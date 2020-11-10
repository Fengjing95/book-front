<!--
 * @Date: 2020-11-10 09:44:40
 * @LastEditors: 小枫
 * @description: description
 * @LastEditTime: 2020-11-10 11:13:20
 * @FilePath: \book\src\components\Review\BookReview.vue
-->
<template lang="pug">
  .book-review
    el-avatar.left(:src="$photoHeader+reviewObj.user.image")
    .right
      .review-name {{reviewObj.user.userName}} 
      .review-date {{reviewObj.reviewDate | intervalTime}}
      .content
        .good(v-if="reviewObj.value>=3") 好评
        .bad(v-else) 差评
        span {{reviewObj.reviewContent}}
</template>

<script>
  export default {
    props: {
      reviewObj: Object
    },
  }
</script>

<style lang="less" scoped>
.book-review {
  padding: 30px 40px 10px 40px;
  text-align: left;
  border-bottom: solid 1px #f0f0f0;
  .left {
    float: left;
  }
  .right {
    margin-left: 50px;
    .review-name {
      font-size: 14px;
      font-weight: 700;
    }
    .review-date {
      margin-top: 5px;
      font-size: 12px;
      color: #777;
    }
    .content {
      padding: 10px 0;
      .good {
        display: inline-block;
        margin-right: 5px;
        width: 30px;
        height: 18px;
        font-size: 12px;
        background: url('../../assets/image/sjIcon.png') no-repeat;
        background-position: 0 -68px;
        padding: 1px 2px 1px 3px;
        color: #ffffff;
      }
      .bad {
        display: inline-block;
        margin-right: 5px;
        width: 30px;
        height: 18px;
        font-size: 12px;
        background: url('../../assets/image/sjIcon.png') no-repeat;
        background-position: 0 -91px;
        padding: 1px 2px 1px 3px;
        color: #ffffff;
      }
    }
  }
}
</style>