/*
 * @Date: 2020-09-24 09:58:26
 * @LastEditors: 小枫
 * @LastEditTime: 2020-10-30 14:47:32
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
    notice: [],
    system: []
  },
  mutations: {
    freshToken(state) {
      state.token = window.localStorage.getItem('token')
    },
    addMessage(state, newMsg) {
      state.message = [...newMsg]
    },
    addSystem(state, system) {
      state.system = [...system]
    },
    addSystemByHttp(state, system) {
      const last = state.system[state.system.length - 1].msgId
      let flag = 0
      for (let i = 0; i < system.length; i++) {
        if (system[i].msgId === last) {
          flag = i
          break
        }
      }
      const newSystem = system.slice(flag)
      state.system.push(...newSystem)
    },
    setOneSystemRead(state, systemId) {
      try {
        state.system.forEach(item => {
          if (item.msgId === systemId) {
            item.read = true
            throw new Error('结束')
          }
        })
      } catch (error) {
        error
      }
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
    },
    SOCKET_SYSTEM(state, system) {
      state.system.unshift(system)
      Notification.success('收到一条系统通知')
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
    },
    getSystem(state) {
      return state.system.filter((item) => {
        return !item.read
      })
    },
    readSystem(state) {
      return state.system
    }
  },
  modules: {
  }
})
