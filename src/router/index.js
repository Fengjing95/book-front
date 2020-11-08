/*
 * @Date: 2020-09-24 09:58:02
 * @LastEditors: 小枫
 * @LastEditTime: 2020-11-06 18:37:57
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
        component: () => import('../components/Personal/PersonalInfo'),
        meta: {
          subtitle: '我的信息',
          subtitleIcon: 'el-icon-user'
        }
      },
      {
        path: 'setting',
        component: () => import('../components/Personal/PersonalSetting'),
        meta: {
          subtitle: '编辑信息',
          subtitleIcon: 'el-icon-edit'
        }
      },
      {
        path: 'record',
        component: () => import('../components/Personal/PersonalRecord'),
        meta: {
          subtitle: '我的阅历',
          subtitleIcon: 'el-icon-notebook-1'
        }
      }
    ]
  },
  {
    path: '/discussion',
    component: () => import('../views/Discussion'),
    meta: {
      keepAlive: true,
      isBack: false
    },
  },
  {
    path: '/discussion/:id',
    name: 'Discussion',
    props: (route) => ({ bdId: route.params.id }),
    component: () => import('../views/DiscussionDetail'),
    meta: {
      keepAlive: true,
      isBack: false
    },
    // 未登录不能进入书圈详情，书圈详情需要token
    beforeEnter: (to, from, next) => {
      if (store.getters.getToken) {
        next()
      } else {
        next(from.path)
      }
    },
  },
  {
    path: '/dynamic/:id',
    name: 'Dynamic',
    props: (route) => ({ dynamicId: route.params.id }),
    component: () => import('../views/Dynamic'),
  },
  {
    path: '/editor/:id',
    name: 'Editor',
    props: (route) => ({ bdId: route.params.id }),
    component: () => import('../views/Editor'),
  },
  {
    path: '/message',
    component: () => import('../views/MessageCenter'),
    beforeEnter: (to, from, next) => {
      if (store.getters.getToken) {
        next()
      } else {
        next(from.path)
      }
    },
  },
  {
    path: '/upload',
    component: () => import('../views/Upload'),
    beforeEnter: (to, from, next) => {
      if (store.getters.getToken) {
        next()
      } else {
        next(from.path)
      }
    },
  },
  // 未命中显示404
  {
    path: '*',
    component: () => import('../views/404')
  }
]

const router = new VueRouter({
  routes
})

export default router
