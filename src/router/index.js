/*
 * @Date: 2020-09-24 09:58:02
 * @LastEditors: 小枫
 * @LastEditTime: 2020-09-25 08:10:34
 * @FilePath: \book\src\router\index.js
 */
import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    component: () => import('../views/Home.vue')
  },
  {
    path: '/about',
    name: 'About',
    component: () => import('../views/About.vue')
  }
]

const router = new VueRouter({
  routes
})

export default router
