<!--
 * @Date: 2020-10-01 08:11:07
 * @LastEditors: 小枫
 * @LastEditTime: 2020-11-06 18:39:57
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

    el-badge.list(
      :is-dot="getMessage.length + getNotReadNotice.length + getSystem.length!==0",
      class="item",
      v-if="getToken",
    )
      el-dropdown(
        trigger="click",
        @command="handleCommand"
      )
        el-avatar(class="avatar", :src="userPhoto")
        el-dropdown-menu(slot="dropdown")
          el-dropdown-item(
            icon="el-icon-bell",
            command="message"
          ) 消息通知
            el-badge(
              v-show="getMessage.length + getNotReadNotice.length + getSystem.length !== 0",
              class="mark",
              :value="getMessage.length + getNotReadNotice.length + getSystem.length",
              :max="99"
            )
          el-dropdown-item(
            v-for="item in list",
            :key="item.command",
            :icon="item.icon",
            :command="item.command"
          ) {{item.name}}
      //- .list(v-else)
    .btn(v-else)
      el-button(type="primary", @click="changeLoginDialogStauts") 登录
    .search-box
      input(
        type="text",
        v-model="searchText",
        @keyup.enter="search"
      )
      i.el-icon-search(@click="search")
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
      searchText: '',
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
        {icon: 'el-icon-upload2', command: 'upload', name: '上传资源'},
        {icon: 'el-icon-date', command: 'attendance', name: '每日签到'},
        {icon: 'el-icon-switch-button', command: 'quit', name: '退出'},
      ],
    };
  },
  computed: {
    ...mapGetters(['getToken', 'getMessage', 'getNotReadNotice', 'getSystem']),  // store中获取token
    // 绑定路由和菜单栏选中项
    route() {
      return "/" + this.$route.path.replace("/", "")
    },
  },
  methods: {
    // TODO: 搜索功能
    // 搜索
    search() {
      console.log(this.searchText);
    },
    // 头像下拉列表指令
    handleCommand(command) {
      switch(command) {
        case 'quit':
          this.$socket.emit('logout', {token: this.$store.getters.getToken})
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
          break;
        case 'attendance':
          this.changeAttendanceDialogStatus()
          break;
        case 'message':
          this.$router.push('/message')
          // this.$store.commit('readAllMsg')
          break;
        case 'upload':
          this.$router.push('/upload')
          break;
        default:
          break;
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
    },
    changeAttendanceDialogStatus() {
      this.$emit("handleAttendance")
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
  background-color: #fff;
  position: sticky;
  top: 0;
  // 防止导航栏被遮挡
  z-index: 999;
  min-width: 1035px;
  // background-color: #e6e6e6;
  border-bottom: solid 1px rgb(167, 165, 165);
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
    .search-box {
      width: 200px;
      margin-top: 9px;
      margin-right: 30px;
      height: 40px;
      float: right;
      border: solid 1px #777;
      border-radius: 20px;
      input {
        width: 160px;
        border: none;
        outline: none;
        height: 40px;
        line-height: 40px;
        font-size: 16px;
        background-color: rgba(0,0,0,0);
        text-indent: 10px;
        color: #777;
      }
      i {
        padding: 0 10px;
      }
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