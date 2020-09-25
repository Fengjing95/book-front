/*
 * @Date: 2020-09-24 09:53:10
 * @LastEditors: 小枫
 * @LastEditTime: 2020-09-25 08:11:24
 * @FilePath: \book\src\main.js
 */
import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import './plugins/element.js'
import axios from 'axios'
import { Message, Loading } from 'element-ui';
import md5 from 'md5';

// md5:密码加密使用
Vue.prototype.$md5 = md5

Vue.config.productionTip = false

axios.defaults.withCredentials = true // 跨域
axios.defaults.baseURL = '/api' // baseUrl:方便修改http地址


// http request 请求拦截器
let loading
axios.interceptors.request.use(request => {
  loading = Loading.service({ fullscreen: true }) // 发出请求时启动加载动画
  request.headers.authorization = window.localStorage.getItem('token') // 请求头携带token
  return request
})
// http response 响应拦截器
axios.interceptors.response.use(response => {
  loading.close() // 关闭加载动画
  if (response.status === 200) { // 200状态码直接放行
    return Promise.resolve(response)
  } else {                       // 否则reject
    return Promise.reject(response)
  }
}, error => {
  loading.close()
  if (error.response.status) {
    // console.log(error.response);
    switch (error.response.status) {
      // 根据错误码拦截响应
      case 402:
        Message({
          type: 'error',
          message: '密码错误'
        });
        break;
    }
  } else { // 没有获取响应
    Message({
      type: 'error',
      message: '连接服务器失败'
    });
  }
})

// 绑定axios到Vue原型
Vue.prototype.$http = axios

// 挂载过滤器=>格式化时间
Vue.filter('formatDate', function (date) {
  const n = new Date(date)
  return n.getFullYear() + '-' + (n.getMonth() + 1) + '-' + n.getDate()
    + ' ' + n.getHours() + ':' + n.getMinutes() + ':' + n.getSeconds()
})

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
