/*
 * @Date: 2020-09-24 09:58:02
 * @LastEditors: 小枫
 * @LastEditTime: 2020-10-08 15:33:57
 * @FilePath: \book\src\router\index.js
 */
import Vue from 'vue'
import VueRouter from 'vue-router'
import store from '../store'

Vue.use(VueRouter)

// 解决路由重复带来的报错
//获取原型对象上的push函数
const originalPush = VueRouter.prototype.push
//修改原型对象中的push方法
VueRouter.prototype.push = function push(location) {
  return originalPush.call(this, location).catch(err => err)
}

const routes = [
  {
    path: '/',
    name: 'Home',
    component: () => import('../views/Home')
  },
  {
    path: '/about',
    name: 'About',
    component: () => import('../views/About')
  },
  {
    path: '/personal',
    component: () => import('../views/Personal'),
    // 导航守卫，没有登录不可以进入个人中心
    beforeEnter: (to, from, next) => {
      if (store.getters.getToken) {
        next()
      } else {
        next(from.path)
      }
      
    },
    children: [
      {
        path: '',
        component: () => import('../components/PersonalInfo'),
        meta: {
          subtitle: '我的信息',
          subtitleIcon: 'el-icon-user'
        }
      },
      {
        path: 'setting',
        component: () => import('../components/PersonalSetting'),
        meta: {
          subtitle: '编辑信息',
          subtitleIcon: 'el-icon-edit'
        }
      },
      {
        path: 'record',
        component: () => import('../components/PersonalRecord'),
        meta: {
          subtitle: '我的阅历',
          subtitleIcon: 'el-icon-notebook-1'
        }
      }
    ]
  }
]

const router = new VueRouter({
  routes
})

export default router
