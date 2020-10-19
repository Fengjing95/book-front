<!--
 * @Date: 2020-10-18 15:22:31
 * @LastEditors: 小枫
 * @description: 评论组件
 * @LastEditTime: 2020-10-19 19:00:54
 * @FilePath: \book\src\components\MyReview.vue
-->
<template lang="pug">
  .review
    el-avatar.left(:src="$photoHeader+reviewObj.userPojo.image")
    .right
      .review-name {{reviewObj.userPojo.userName}}
      .review-date {{reviewObj.drDate | intervalTime}}
      .reply(v-if="reviewObj.drPid !== reviewObj.drSpid")
        span(style="color: #777;") 回复 
        span {{reviewObj.repUserPojo.userName}}:
      .content
        .content-text {{reviewObj.drContent}}
        el-button.content-btn(type="text", @click="showForm") 回复
      .review-input(v-if="isShowForm", @mousedown.prevent)
        el-input(
          ref="reviewInput",
          @blur="hiddenForm",
          v-model="content",
          :placeholder='`回复@${reviewObj.userPojo.userName}`'
          @mousedown.stop
        )
        el-button.reply-btn(
          size="small",
          @click="sendReview",
          type="primary",
          :disabled="content === ''"
        ) {{btnText}}
      slot/
</template>

<script>
  export default {
    props: {
      reviewObj: Object
    },
    data() {
      return {
        isShowForm: false,
        content: '',
        btnText: '回复'
      }
    },
    methods: {
      showForm() {  // 显示评论框
        if(!this.isShowForm) {
          this.isShowForm = true
          this.$nextTick(() => {
            this.$refs.reviewInput.focus()
          })
        }
      },
      hiddenForm() {  // 隐藏评论框
        this.isShowForm = false
      },
      sendReview() {
        console.log(1);
        this.btnText = '发送中……'
        setTimeout(() => {
          this.content = ''
          this.btnText = '回复'
          this.$refs.reviewInput.blur()
        }, 2000)
        
      }
    },
  }
</script>

<style lang="less" scoped>
.review {
  // margin-bottom: 10px;
  padding: 10px;
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
      display: flex;
      padding: 10px 0;
      .content-text {
        flex: 1;
      }
      .content-btn {
        padding: 0;
      }
    }
    .reply {
      margin-top: 5px;
      font-size: 14px;
      flex-wrap:wrap;
    }
    .review-input {
      display: flex;
      .reply-btn {
        margin-left: 20px;
      }
    }
  }
}
</style>