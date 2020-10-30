<!--
 * @Date: 2020-10-26 20:22:37
 * @LastEditors: 小枫
 * @description: 消息组件
 * @LastEditTime: 2020-10-30 16:03:28
 * @FilePath: \book\src\components\Message\MessageItem.vue
-->
<template lang="pug">
  .message-item(:class="messageObj.read ? 'read' : 'no-read'", @click.capture="readById")
    el-avatar(class="avatar", :src="$photoHeader+messageObj.avatarUrl")
    .content
      .date {{messageObj.msgDate | intervalTime}}
      span.username {{messageObj.userName}}
      //- 0 点赞 1 评论 2 系统
      span(v-if="messageObj.type===0")  点赞了你的动态
      span(v-else-if="messageObj.type===1")  评论了你：
        span.review {{messageObj.msg}}
      span(v-else)  {{messageObj.msg}}
    .link(v-if="messageObj.type===0||messageObj.type===1")
      router-link(:to="`/dynamic/${messageObj.dynamicId}`") 查看详情
</template>

<script>
  export default {
    props: {
      messageObj: Object
    },
    // created () {
    //   console.log(this.messageObj);
    // },
    methods: {
      readById() {
        if(this.messageObj.type === 0 || this.messageObj.type === 1) {
          this.$http.get(`/msg/hasread?msgId=${this.messageObj.msgId}`).then(
            res => {
              if(res) {
                this.$store.commit('setOneRead', this.messageObj.msgId)
              }
            }
          )
        } else {
          this.$http.get(`/msg/hasread?msgId=${this.messageObj.msgId}`).then(
            res => {
              if(res) {
                this.$store.commit('setOneSystemRead', this.messageObj.msgId)
              }
            }
          )
        }
      }
    },
  }
</script>

<style lang="less" scoped>
.no-read {
  border: solid 1px #ffaac3;
  background-color: #fff3f7;
}
.read {
  border: solid 1px #badcdc;
  background-color: #f9fcfc;
}
.message-item {
  margin: 10px 20px;
  padding: 5px 10px;
  border-radius: 10px;
  display: flex;
  .content {
    text-align: left;
    flex: 1;
    // line-height: 40px;
    margin-left: 20px;
    margin-right: 20px;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    cursor: default;
    .username {
      color: #83c0ff;
      font-size: 14px;
    }
    .review {
      color: #777;
    }
    .date {
      font-size: 12px;
      color:#bfbfbf;
      // line-height: 40px;
    }
  }
  .link {
    line-height: 40px;
    a {
      text-decoration: none;
      color: #409eff;
    }
  }
}
</style>