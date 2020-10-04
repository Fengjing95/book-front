/*
 * @Date: 2020-09-24 09:58:26
 * @LastEditors: 小枫
 * @LastEditTime: 2020-10-01 08:51:37
 * @FilePath: \book\src\store\index.js
 */
import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    token: window.localStorage.getItem('token')
  },
  mutations: {
    freshToken(state) {
      state.token = window.localStorage.getItem('token')
    }
  },
  actions: {
  },
  getters: {
    getToken(state) {
      return state.token
    }
  },
  modules: {
  }
})
