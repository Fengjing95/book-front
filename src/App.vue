<!--
 * @Date: 2020-09-24 09:53:10
 * @LastEditors: 小枫
 * @LastEditTime: 2020-10-08 19:25:26
 * @FilePath: \book\src\App.vue
-->
<template lang="pug">
  #app
    nav-bar(@handleNavLogin="loginDialog", :userPhoto="photoUrl")/
    //- login-dialog(:loginVisableSon="loginVisable", @closeDialog="closeLoginDialog")
    el-dialog(
      :visible.sync="loginVisable",
      width="380px",
      close-on-click-modal=false,
      top="20vh",
      close="getPhotoUrl",
    )
      login-dialog(@closeLogin="closeLoginDialog")
      //- login-dialog/
    router-view(v-if="isRouterAlive")/
    
</template>

<script>
import NavBar from './components/NavBar.vue'
import loginDialog from './components/LoginDialog.vue';
export default {
  provide() {
    return {
      fresh: this.freshPhotoUrl,
      reload: this.reload
    }
  },
  name: 'app',
  components: {
    NavBar,
    loginDialog
  },
  data() {
    return {
     // 登录组件显隐
      loginVisable: false,
      photoUrl: '',
      isRouterAlive: true
    }
  },
  methods: {
    loginDialog() {
      this.loginVisable = true
    },
    closeLoginDialog(val) {
      this.photoUrl = val
      window.localStorage.setItem('userPhoto', val)
      this.loginVisable = false
    },
    // getPhotoUrl() {
    //   this.$http.get('').then(res => {
    //     if(res) {
    //       this.photoUrl = res.data
    //     }
    //   })
    // }
    freshPhotoUrl() {
      this.photoUrl = window.localStorage.getItem('userPhoto')
    },
    reload() {
      this.isRouterAlive = false
      this.$nextTick(function() {
        this.isRouterAlive = true
      })
    }
  },
  created() {
    this.freshPhotoUrl()
  }
}
</script>

<style>
body {
  margin: 0 auto;
}
body::-webkit-scrollbar {
  /*滚动条整体样式*/
  width: 10px; /*高宽分别对应横竖滚动条的尺寸*/
  height: 1px;
}
body::-webkit-scrollbar-thumb {
  /*滚动条里面小方块*/
  border-radius: 10px;
  background-color: skyblue;
  background-image: -webkit-linear-gradient(
    45deg,
    rgba(255, 255, 255, 0.2) 25%,
    transparent 25%,
    transparent 50%,
    rgba(255, 255, 255, 0.2) 50%,
    rgba(255, 255, 255, 0.2) 75%,
    transparent 75%,
    transparent
  );
}
body::-webkit-scrollbar-track {
  /*滚动条里面轨道*/
  box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
  background: #ededed;
  border-radius: 10px;
}
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
</style>
