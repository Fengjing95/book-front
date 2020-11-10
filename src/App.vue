<!--
 * @Date: 2020-09-24 09:53:10
 * @LastEditors: 小枫
 * @LastEditTime: 2020-11-08 19:23:25
 * @FilePath: \book\src\App.vue
-->
<template lang="pug">
  #app
    nav-bar(
      @handleNavLogin="loginDialog",
      :userPhoto="photoUrl",
      @handleAttendance="displayAttendance"
    )/
    //- login-dialog(:loginVisableSon="loginVisable", @closeDialog="closeLoginDialog")
    el-dialog(
      :visible.sync="loginVisable",
      width="380px",
      close-on-click-modal=false,
      top="20vh",
      close="getPhotoUrl",
      :destroy-on-close="true"
      show-close=true
    )
      login-dialog(@closeLogin="closeLoginDialog")
      //- login-dialog/
    daily-attendance(ref="attendanceRef")/
    audio(
      controls="controls",
      hidden,
      src="./assets/mp3/message.mp3",
      ref="audio"
    )
    el-backtop/
    keep-alive
      router-view(v-if="isRouterAlive && $route.meta.keepAlive")/
    router-view(v-if="isRouterAlive && !$route.meta.keepAlive")/
    
</template>

<script>
import NavBar from './components/NavBar.vue'
import loginDialog from './components/LoginDialog.vue'
import DailyAttendance from './components/Attendance/DailyAttendance.vue'
import Message from './assets/js/Message';
// import { mapGetters } from 'vuex'
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
    loginDialog,
    DailyAttendance
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
    },
    displayAttendance() {
      this.$refs.attendanceRef.displayAttDialog()
    },
    // 上线或重新登陆获取消息
    getMessage() {
      this.$http.get(`/msg/querymsg?pageNumber=1&pageSize=100`).then(
        res => {
          if(res) {
            // console.log(res);
            this.$store.commit('addMessage', res.data.obj.content)
          }
        }
      )
    },
    // 上线获取公告
    getNotice() {
      this.$http.get('/notice/user/querynotice?pageNumber=1&pageSize=100').then(
        res => {
          if(res) {
            // console.log(res);
            this.$store.commit('getNotice', res.data.obj.content)
          }
        }
      )
    },
    // 上线获取系统通知
    getSystem() {
      this.$http.get('/msg/querysystem?pageNumber=1&pageSize=100').then(
        res => {
          if(res) {
            // console.log(res);
            this.$store.commit('addSystem', res.data.obj.content)
          }
        }
      )
    }
  },
  computed: {
    // ...mapGetters['getToken']
    tn() {
      return this.$store.getters.getToken
    }
  },
  watch: {
    tn(newVal) {
      if(newVal !== null) {
        this.$socket.emit('set_info', {msg: newVal})
        this.getMessage()
        this.getNotice()
        this.getSystem()
      }
    }
  },
  created() {
    console.log('%cstop!','color: red;font-size: 40px;font-weight:700;text-shadow:2px 2px 0px #000');
    console.log('我们不建议您使用开发者工具进行任何操作，除非您具有一定的技能，否则出现任何后果我们将不予承担！！！');
    console.log('%c书源%c已打开',
      'background-color: #6efd12;color: #fff;padding: 3px 2px 3px 5px;border-radius: 5px 0 0 5px;',
      'background-color: #000000;color: #fff;padding: 3px 5px 3px 2px;border-radius: 0 5px 5px 0;');
    const mode = process.env.NODE_ENV ==='development' ? '开发' : '生产'
    console.log(`%c${mode}%c模式`,
      'background-color: #409eff;color: #fff;padding: 3px 2px 3px 5px;border-radius: 5px 0 0 5px;',
      'background-color: #000000;color: #fff;padding: 3px 5px 3px 2px;border-radius: 0 5px 5px 0;');
    this.freshPhotoUrl()
  },
  sockets: {
    connect() {
      console.log('%csocket%c已连接',
        'background-color: #db310d;color: #fff;padding: 3px 2px 3px 5px;border-radius: 5px 0 0 5px;',
        'background-color: #000000;color: #fff;padding: 3px 5px 3px 2px;border-radius: 0 5px 5px 0;');
      if(localStorage.getItem('token')) {
        const message = new Message()
        message.msg = localStorage.getItem('token')
        this.$socket.emit('set_info', message)
        this.getMessage()
        this.getNotice()
        this.getSystem()
      }
    },
    LIKE() {
      this.$refs.audio.currentTime = 0; //从头开始播放提示音
      this.$refs.audio.play(); //播放
    },
    REVIEW() {
      this.$refs.audio.currentTime = 0; //从头开始播放提示音
      this.$refs.audio.play(); //播放
    },
    NOTICE() {
      this.$refs.audio.currentTime = 0; //从头开始播放提示音
      this.$refs.audio.play(); //播放
    }
  }
}
</script>

<style>
body {
  margin: 0 auto;
  background-color: #EDEEF3;
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
