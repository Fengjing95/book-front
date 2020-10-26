/*
 * @Date: 2020-09-24 09:58:26
 * @LastEditors: 小枫
 * @LastEditTime: 2020-10-26 16:23:50
 * @FilePath: \book\src\store\index.js
 */
import Vue from 'vue'
import Vuex from 'vuex'
import { Notification } from 'element-ui'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    token: window.localStorage.getItem('token'),
    message: []
  },
  mutations: {
    freshToken(state) {
      state.token = window.localStorage.getItem('token')
    },
    addMessage(state, newMsg) {
      state.message = [...newMsg]
    },
    readAllMsg(state) {
      state.message.forEach(item => {
        item.read = true
      })
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
    }
  },
  modules: {
  }
})
