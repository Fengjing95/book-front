/*
 * @Date: 2020-09-24 09:58:26
 * @LastEditors: 小枫
 * @LastEditTime: 2020-10-28 19:07:08
 * @FilePath: \book\src\store\index.js
 */
import Vue from 'vue'
import Vuex from 'vuex'
import { Notification } from 'element-ui'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    token: window.localStorage.getItem('token'),
    message: [],
    notice: []
  },
  mutations: {
    freshToken(state) {
      state.token = window.localStorage.getItem('token')
    },
    addMessage(state, newMsg) {
      state.message = [...newMsg]
    },
    addMsgByHttp(state, msgs) {
      const last = state.message[state.message.length - 1].msgId
      let flag = 0
      for (let i = 0; i < msgs.length; i++) {
        if (msgs[i].msgId === last) {
          flag = i
          break
        }
      }
      const newMsg = msgs.slice(flag)
      state.message.push(...newMsg)
    },
    readAllMsg(state) {
      state.message.forEach(item => {
        item.read = true
      })
    },
    setOneRead(state, msgId) {
      try {
        state.message.forEach(item => {
          if (item.msgId === msgId) {
            item.read = true
            throw new Error('结束')
          }
        })
      } catch (error) {
        error
      }
    },
    getNotice(state, notice) {
      state.notice = [...notice]
    },
    setNoticeRead(state, noticeId) {
      try {
        state.notice.forEach(item => {
          if (item.noticeId === noticeId) {
            item.read = true
            item.nums++
            throw new Error('结束')
          }
        })
      } catch (error) {
        error
      }
    },
    SOCKET_NOTICE(state, newNotice) {
      state.notice.unshift(newNotice)
      Notification.success('有最新公告，请尽快查看')
    },
    SOCKET_REVIEW(state, msg) {
      // console.log(msg);
      state.message.unshift(msg)
      Notification.success('收到一条评论')
    },
    SOCKET_LIKE(state, msg) {
      state.message.unshift(msg)
      Notification.success('收到一条点赞消息')
    }
  },
  actions: {
  },
  getters: {
    getToken(state) {
      return state.token
    },
    getMessage(state) {
      return state.message.filter((item) => {
        return !item.read
      })
    },
    readMessage(state) {
      return state.message
    },
    getNotReadNotice(state) {
      return state.notice.filter((item) => {
        return !item.read
      })
    },
    readNotice(state) {
      return state.notice
    }
  },
  modules: {
  }
})
