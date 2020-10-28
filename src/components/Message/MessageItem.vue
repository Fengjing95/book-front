<!--
 * @Date: 2020-10-26 20:22:37
 * @LastEditors: 小枫
 * @description: 消息组件
 * @LastEditTime: 2020-10-27 20:47:46
 * @FilePath: \book\src\components\Message\MessageItem.vue
-->
<template lang="pug">
  .message-item(:class="messageObj.read ? 'read' : 'no-read'", @click="readById")
    el-avatar(class="avatar", :src="$photoHeader+messageObj.avatarUrl")
    .content
      .date {{messageObj.msgDate | intervalTime}}
      span.username {{messageObj.userName}}
      span(v-if="messageObj.type===0")  点赞了你的动态
      span(v-else)  评论了你：
      span.review {{messageObj.msg}}
      
    .link
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
        this.$http.get(`/msg/hasread?msgId=${this.messageObj.msgId}`).then(
          res => {
            if(res) {
              this.$store.commit('setOneRead', this.messageObj.msgId)
            }
          }
        )
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