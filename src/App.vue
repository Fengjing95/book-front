<!--
 * @Date: 2020-09-24 09:53:10
 * @LastEditors: 小枫
 * @LastEditTime: 2020-10-04 10:49:58
 * @FilePath: \book\src\App.vue
-->
<template lang="pug">
  #app
    nav-bar(@handleNavLogin="loginDialog")/
    //- login-dialog(:loginVisableSon="loginVisable", @closeDialog="closeLoginDialog")
    el-dialog(
      :visible.sync="loginVisable",
      width="380px",
      close-on-click-modal=false,
      show-close=false,
      top="20vh",
    )
      login-dialog(@closeLogin="closeLoginDialog")
      //- login-dialog/
    router-view/
    
</template>

<script>
import NavBar from './components/NavBar.vue'
import loginDialog from './components/LoginDialog.vue';
export default {
  name: 'app',
  components: {
    NavBar,
    loginDialog
  },
  data() {
    return {
     // 登录组件显隐
      loginVisable: false,
    }
  },
  methods: {
    loginDialog() {
      this.loginVisable = true
    },
    closeLoginDialog() {
      this.loginVisable = false
    }
  },
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
@media (max-width: 780px) {
  #app::before {
  content: '请到PC端浏览以获得更好的体验';
  color: #777
}
}
</style>
