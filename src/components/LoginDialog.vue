<!--
 * @Date: 2020-10-01 08:03:40
 * @LastEditors: 小枫
 * @LastEditTime: 2020-10-09 09:20:17
 * @FilePath: \book\src\components\LoginDialog.vue
-->
<template lang="pug">
.login
  .header-title(slot="title")
    h3(v-if="loginWay") 手机登录
    h3(v-else) 账密登录
  .login-form(v-show="loginWay")
    el-form(:model="phoneForm", :rules="phoneFormRules", ref="phoneFormRef")
      el-form-item(prop="phone")
        el-input(placeholder="请输入手机号", v-model="phoneForm.phone")
      .ver-code
        el-input.code-input(placeholder="验证码", v-model="phoneForm.verCode")
        el-button.code-btn(:disabled="canGetCode", @click="sendVerityCode") 发送
          span(v-if="canGetCode") ({{time}}秒)
  .login-form(v-show="!loginWay")
    el-form(:model="loginForm", :rules="loginFormRules", ref="loginFormRef")
      el-form-item(prop="username")
        el-input(placeholder="请输入手机号", v-model="loginForm.username")
      el-form-item(prop="password")
        el-input(
          placeholder="请输入密码",
          v-model="loginForm.password",
          @keyup.enter.native="login"
          show-password
        )
  .dialog-footer(slot="footer")
    el-button(
      style="width: 100%;",
      type="primary",
      @click="login",
      width="100%"
    ) 登录
    .btn
      el-button.left-btn(type="text", @click="switchLoginWay") 切换方式登录
      el-button.right-btn(type="text", @click="updatePassword", v-if="!loginWay")
        i.el-icon-lock 忘记密码
    p(style="margin: 5px 0;clear: both;") 注册登录即表示同意
      el-link(
        type="primary",
        href="https://www.baidu.com",
        target="_blank"
      ) 用户协议
      span 、
      el-link(
        type="primary",
        href="https://www.baidu.com",
        target="_blank"
      ) 隐私政策
</template>

<script>
export default {
  data() {
    return {
      // 登录表单
      loginForm: {
        username: "",
        password: "",
      },
      // 登录合法性检验
      loginFormRules: {
        username: [
          { required: true, message: "请输入手机号", trigger: "blur" },
          { min: 11, max: 11, message: "长度11位", trigger: "blur" },
        ],
        password: [
          { required: true, message: "请输入密码", trigger: "blur" },
          { min: 6, message: "长度不小于6", trigger: "blur" },
        ],
      },
      // 手机登录表单
      phoneForm: {
        phone: "",
        verCode: "",
      },
      // 手机合法性检验
      phoneFormRules: {
        phone: [
          { required: true, message: "请输入手机号", trigger: "blur" },
          { min: 11, max: 11, message: "手机长度11位", trigger: "blur" },
        ],
      },
      // 登录方式：true为手机验证码登录，false是账号密码登录
      loginWay: true,
      // 是否禁用发送验证码
      canGetCode: false,
      // 间隔时间
      COUNT_TIME: 60,
      time: 60,
    };
  },
  methods: {
    login() {
      if (this.loginWay) {
        this.loginByPhone()
      } else {
        this.loginByUsername()
      }
    },
    loginByUsername() {
      this.$refs["loginFormRef"].validate((valid) => {
        if (valid) {
          // 加密
          let md5Form = {
            phone: this.loginForm.username,
            password: this.$md5(this.loginForm.password)
          }
          // console.log(this.$md5(this.loginForm.password));
          // 发送账号密码
          this.$http.post('/user/login', md5Form).then(res => {
            if(res) {
              // console.log(res.data.obj);
              this.$message({
                type: "success",
                message: '登录成功'
              })
              // 处理token
              window.localStorage.setItem('token', res.data.obj.token)
              // 更新vuex中的状态
              this.$store.commit('freshToken')
              // 登录成功之后关闭对话框
              this.$emit("closeLogin", this.$photoHeader + res.data.obj.image);
            }
          })
        }
      })
    },
    async loginByPhone() {
      const valid = await this.$refs["phoneFormRef"]
        .validate()
        .catch((err) => err)
      if (valid && this.phoneForm.verCode !== "") {
        const pvobj = {
          phone: this.phoneForm.phone,
          code: this.phoneForm.verCode
        }
        // 发送手机号和验证码
        this.$http.post('/user/plogin', pvobj).then(res => {
          if(res) {
            console.log(res);
            this.$message({
                type: "success",
                message: '登录成功'
              })
            // 处理token
            window.localStorage.setItem('token', res.data.obj.token)
            // 更新vuex中的状态
            this.$store.commit('freshToken')
            // 登录成功之后关闭对话框
              console.log(this.$photoHeader + res.data.obj.image);
            this.$emit("closeLogin", this.$photoHeader + res.data.obj.image);
          }
        })
      } else if(valid && this.phoneForm.verCode === "") {
        this.$message({
          type: 'error',
          message: '验证码不可为空'
        })
      }
    },
    // closeLoginForm () {
    //   this.$emit('closeLogin')
    // },
    // 切换登录方式
    switchLoginWay() {
      this.loginWay = !this.loginWay;
    },
    // 发送验证码
    sendVerityCode() {
      this.$refs["phoneFormRef"].validate((valid) => {
        if (valid) {
          // 发送请求
          const pobj = {
            phone: this.phoneForm.phone
          }
          this.$http.post('/user/getsms', pobj).then(res => {
            if(res) {
              this.$message({
                type: "success",
                message: '发送成功'
              })
              // 成功开始计时
              this.canGetCode = true;
              let timer = this.COUNT_TIME;
              let auth_timer = setInterval(() => {
                timer--; //递减时间
                this.time = timer
                if (timer <= 0) {
                  this.canGetCode = false; //60s时间结束还原状态并清除定时器
                  this.time = 60 // 防止下一次点击显示0
                  clearInterval(auth_timer)
                }
              }, 1000);
            }
          })
        }
      });
    },
    updatePassword() {
      this.$emit("closeLogin", '')
      this.$router.push('/update-password')
    }
  },
};
</script>

<style lang="less" scoped>
.login {
  position: relative;
  .btn {
    margin: 10px;
    .left-btn {
      float: left;
    }
    .right-btn {
      float: right;
    }
  }
  .header-title {
    position: absolute;
    top: -50px;
    left: 0;
  }
  .login-form {
    margin-bottom: 22px;
    .ver-code {
      display: flex;
      .code-input {
        flex: 4;
        margin-right: 10px;
      }
      .code-btn {
        flex: 1;
      }
    }
  }
}
</style>
