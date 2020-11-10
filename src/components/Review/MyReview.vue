<!--
 * @Date: 2020-10-18 15:22:31
 * @LastEditors: 小枫
 * @description: 评论组件
 * @LastEditTime: 2020-11-10 09:44:04
 * @FilePath: \book\src\components\Review\MyReview.vue
-->
<template lang="pug">
  .review
    el-avatar.left(:src="$photoHeader+reviewObj.userPojo.image")
    .right
      .review-name {{reviewObj.userPojo.userName}} 
      .review-date {{reviewObj.drDate | intervalTime}} 
        span(v-if="myId===reviewObj.userId || isMine") · 
          el-button(
            type="text",
            style="color: #777;padding: 0;",
            @click="deleteReview"
          ) 删除
      .reply(v-if="reviewObj.drPid !== reviewObj.drSpid")
        span(style="color: #777;") 回复 
        span {{reviewObj.repUserPojo ? reviewObj.repUserPojo.userName : '原评论已删除'}}:
      .content
        .content-text {{reviewObj.drContent}}
        el-button.content-btn(type="text", @click="showForm", :disabled="isBanned") 回复
      .review-input(v-if="isShowForm", @mousedown.prevent)
        el-input(
          ref="reviewInput",
          @blur="hiddenForm",
          v-model="content",
          :placeholder='`回复@${reviewObj.userPojo.userName}`',
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
import Message from '../../assets/js/Message'
  export default {
    props: {
      reviewObj: Object,
      isMine: {
        type: Boolean,
        default: false,
      },
      myId: {
        type: Number,
        default: 0,
      },
      isBanned: Boolean
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
        this.content = ''
      },
      sendReview() {
        this.btnText = '发送中……'
        const sendReviewObj = {
          reviewContent: this.content,
          parentId: this.reviewObj.drId,
          supParentId: this.reviewObj.drSpid === 0 ? this.reviewObj.drId : this.reviewObj.drSpid,
          dynamicId: this.reviewObj.dynamicId,
        }
        this.$http.post('/dynamicreview/releasereview', sendReviewObj).then(
          res => {
            if(res) {
              if(this.myId !== this.reviewObj.userId) {
                const message = new Message()
                message.targetId = this.reviewObj.userId
                message.msg = sendReviewObj.reviewContent
                message.token = this.$store.getters.getToken
                message.dynamicId = this.reviewObj.dynamicId
                this.$socket.emit('send_review', message)
              }
            }
          }
        ).finally(() => {
          this.content = ''
          this.btnText = '回复'
          this.$nextTick(() => {
            this.$refs.reviewInput.blur()
          })
          this.$emit('refreshReview')
        })
      },
      deleteReview() {
        this.$http.get(`/dynamicreview/deletereview?dId=${this.reviewObj.dynamicId}&reviewId=${this.reviewObj.drId}`).then(
          res => {
            if(res) {
              // console.log(res);
              this.$emit('refreshReview')
            }
          }
        )
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