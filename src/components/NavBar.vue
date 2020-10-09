<!--
 * @Date: 2020-10-01 08:11:07
 * @LastEditors: 小枫
 * @LastEditTime: 2020-10-09 08:57:36
 * @FilePath: \book\src\components\NavBar.vue
-->
<template lang="pug">
.nav-bar
  el-menu.el-menu(
    :default-active="route",
    mode="horizontal",
    active-text-color="#409eff",
    
    router
  )
    el-menu-item.item-logo
      img.logo(src="../assets/image/book-logo.png", @click="$router.push('/')")
    el-menu-item(
      v-for="item in menu",
      :key="item.route",
      :index="item.route"
    ) {{ item.name }}

    el-dropdown.list(
      v-if="getToken",
      trigger="click",
      @command="handleCommand"
    )
      el-avatar(class="avatar", :src="userPhoto")
      el-dropdown-menu(slot="dropdown")
        el-dropdown-item(
          v-for="item in list",
          :key="item.command",
          :icon="item.icon",
          :command="item.command"
        ) {{item.name}}
    //- .list(v-else)
    .btn(v-else)
      el-button(type="primary", @click="changeLoginDialogStauts") 登录
</template>

<script>
import {mapGetters} from 'vuex'
export default {
  props: {
    // 用户头像
    userPhoto: String
  },
  data() {
    return {
      // 菜单项
      menu: [
        { route: "/", name: "首页" },
        { route: "/discussion", name: "书圈" },
        { route: "/history", name: "历史记录" },
        { route: "/bookcase", name: "我的书架" },
        { route: "/about", name: "关于" },
      ],
      // 下拉列表项
      list: [
        {icon: 'el-icon-user', command: 'personal', name: '个人中心'},
        {icon: 'el-icon-switch-button', command: 'quit', name: '退出'},
      ],
    };
  },
  computed: {
    ...mapGetters(['getToken']),  // store中获取token
    // 绑定路由和菜单栏选中项
    route() {
      return "/" + this.$route.path.replace("/", "")
    },
  },
  methods: {
    // 头像下拉列表指令
    handleCommand(command) {
      switch(command) {
        case 'quit':
          this.$http.get('/user/logout').then(
            res => {
              if(res) {
                this.$message({
                  type: 'success',
                  message: '退出成功'
                })
                window.localStorage.clear()
                this.$store.commit('freshToken')
              }
            }
          )
          this.$router.push('/').catch(
            error => {
              error // 拦截错误：首页退出会报错，因为相同路由跳转两次
            }
          )
          break;
        case 'personal':
          this.$router.push('/personal')
      }
    },
    // 获取用户信息，提取头像地址
    getUserInfo() {
      this.$http.get('获取用户信息').then(res => {
        if(res) {
          this.userPhoto = res.data
        }
      })
    },
    // 显示登录对话框
    changeLoginDialogStauts() {
      this.$emit("handleNavLogin")
    }
  },
  created () {
    // created声明周期获取用户信息
    // this.getUserInfo()
  },
};
</script>

<style lang="less" scoped>
.el-menu.el-menu--horizontal {
  border-bottom: none;
}
.nav-bar {
  position: sticky;
  top: 0;
  min-width: 1035px;
  // background-color: #e6e6e6;
  border-bottom: solid 1px rgb(207, 206, 206);
  .el-menu {
    .item-logo {
      border-bottom: none;
      .logo {
        width: 130px;
        height: 45px;
      }
    }
    width: 1000px;
    margin: 0 auto;
    // min-width: 1000px;
    // padding-left: 20%;
    // padding-right: 20%;
    .list {
      float: right;
      margin-top: 10px;
    }
    .btn {
      float: right;
      margin-top: 10px;
    }
  }
  // @media screen and (max-width: 780px) {
  //   width: 100vw;
  //   min-width: 780px;
  //   .el-menu {
  //     // width: ;
  //     min-width: 780px;
  //     .logo {
  //       display: none;
  //     }
  //     padding-left: 0;
  //     padding-right: 0;
  //     // .btn {
  //     //   display: none;
  //     // }
  //   }
  // }
}
</style>