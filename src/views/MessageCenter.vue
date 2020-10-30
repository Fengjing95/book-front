<!--
 * @Date: 2020-10-26 18:59:54
 * @LastEditors: 小枫
 * @description: 消息中心
 * @LastEditTime: 2020-10-29 21:46:36
 * @FilePath: \book\src\views\MessageCenter.vue
-->
<template lang="pug">
  .message-center
    el-tabs(tabPosition="left")
      el-tab-pane
        span.title(slot="label")
          el-badge(:is-dot="$store.getters.getMessage.length!==0")
            i.el-icon-message-solid  通知
        div(style="text-align: right;margin-right: 20px")
          el-button(size="small", @click="readAll") 全部设为已读
        message-item(
          v-for="(item, index) in readMessage",
          :key="index",
          :messageObj="item"
        )/
        el-button(
          type="text",
          :disabled="isBottom",
          @click="nextPage"
        ) {{isBottom ? '已经到底了' : '加载更多'}}
      el-tab-pane
        span.title(slot="label")
          el-badge(:is-dot="$store.getters.getNotReadNotice.length!==0")
            i.el-icon-s-order  公告
        el-collapse(
          style="padding: 0 20px; text-align: left;",
          accordion,
          @change="read"
        )
          el-collapse-item(
            v-for="(item, index) in $store.getters.readNotice",
            :key="index",
            :name="item.noticeId",
          )
            template(slot="title")
              .date(style="margin-right: 10px; color: #d2d2d2;") {{item.noticeDate | intervalTime}}
              .notice-title(style="line-height: 16px;padding-right: 15px;color: #83c0ff") {{item.noticeTitle}}
                el-badge.item(value="new" v-show="!item.read")
            div(style="background-color: #fdfcf0;padding: 10px;border-radius: 5px;")
              .nums(style="color: #d2d2d2;") {{item.nums ? '已有'+item.nums+'人读过':''}}
              .markdown-body(v-html="item.noticeContent")
      el-tab-pane
        span.title(slot="label")
          el-badge(:is-dot="$store.getters.getSystem.length !== 0")
            i.el-icon-s-check  系统
        message-item(
          v-for="(item, index) in readSystem",
          :key="index",
          :messageObj="item"
        )/
</template>

<script>
import { mapGetters } from 'vuex'
import MessageItem from '../components/Message/MessageItem'
  export default {
    components: {
      MessageItem,
    },
    data() {
      return {
        msgPageNumber: 1,
        msgAllPageNumber: null,
      }
    },
    computed: {
      ...mapGetters(['readMessage', 'readSystem']),
      isBottom() {
        return this.$store.getters.readMessage.length < 100 || this.msgPageNumber === this.msgAllPageNumber
      }
    },
    methods: {
      // 全部设为已读
      readAll() {
        this.$http.get('/msg/readall').then(
          res => {
            if(res) {
              this.$store.commit('readAllMsg')
            }
          }
        )
      },
      nextPage() {
        this.$http.get(`/msg/querymsg?pageNumber=${this.msgPageNumber+1}&pageSize=100`).then(
          res => {
            if(res) {
              this.$store.commit('addMsgByHttp', res.data.obj.content)
              this.msgPageNumber++
              this.msgAllPageNumber = res.data.obj.totalPages
            }
          }
        )
      },
      readReq(noticeId) {
        this.$http.get(`/notice/user/readnotice?noticeId=${noticeId}`).then(
          res => {
            if(res) {
              res
            }
          }
        )
      },
      read(val) {
        if(val) {
          const notice = this.$store.getters.readNotice.filter(item => {
            return item.noticeId === val
          })
          if(notice[0].read === false) {
            this.$store.commit('setNoticeRead', val)
            this.readReq(val)
          }
        }
      }
    },
  }
</script>

<style lang="less" scoped>
.message-center {
  margin: 0 auto;
  width: 1000px;
  min-height: calc(100vh - 61px);
  background-color: #fff;
  padding: 20px;
  box-sizing: border-box;
  .title {
    margin: 0 50px;
    font-size: 15px;
    line-height: 15px;
  }
}
</style>