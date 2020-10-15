<!--
 * @Date: 2020-10-08 14:54:06
 * @LastEditors: 小枫
 * @LastEditTime: 2020-10-12 09:57:35
 * @FilePath: \book\src\components\Personal\PersonalSetting.vue
-->
<template lang="pug">
  .persaonal-setting
    .name-editor
      el-form(
        ref="usernameRef",
        :rules="rules",
        :model="newUsername",
        label-width="80px",
        :inline="true",
        status-icon
      )
        el-form-item(
          label="昵称",
          prop="userName"
        )
          el-input(v-model="newUsername.userName", @keyup.enter.native="updateUsername")
          input(type="text", style="display:none")
        el-form-item
          el-button(
            type="primary",
            :disabled="userInfo.userName === newUsername.userName",
            @click="updateUsername"
          ) 修改
    .password-editor
      el-form(label-width="80px",)
        el-form-item(label="密码")
          el-button(
            type="text",
            @click="uploadPwdDlgVisibility = true"
          ) {{userInfo.password === 'exist' ? '修改密码' : '设置密码'}}
    el-dialog(
      :visible.sync="uploadPwdDlgVisibility",
      width="380px",
      close-on-click-modal=false,
      top="20vh",
    )
      span(slot="title") 将向
        span(style="color: #409eff") {{userInfo.userPhone | hidePhone}}
        span 发送验证码
      el-form
        el-form-item
          .code-flex
            el-input.code-ipt(
              v-model="pwdObj.code",
              placeholder="输入验证码",
              name="rePwdCode",
              autocomplete="new-password"
            )
            el-button.code-btn(:disabled="canGetCode", @click="sendSMS") 发送
              span(v-if="canGetCode") ({{time}}秒)
        el-form-item
          el-input(
            v-model="pwdObj.password",
            placeholder="输入新密码",
            type="password",
            name="rePwdNew",
            autocomplete="new-password",
            @keyup.enter.native="updatePassword",
            show-password
          )
      div(slot="footer")
        el-button(@click="updatePassword", type="primary") 修改
</template>

<script>
  export default {
    inject: ['reload'],
    data() {
      // 合法性校验规则
      const checkUsername = (rule, value, callback) => {
        if (!value) {
          callback(new Error('昵称不能为空'))
        } else if(!/^[a-zA-Z0-9_/\u4E00-\u9FA5]+$/.test(value)) {
          callback(new Error('只能包含中文、英文、数字和“_”'))
        } else {
          callback()
        }
      }
      return {
        userInfo: {},
        newUsername: {
          userName: ''
        },
        rules: {
          userName: [
            { validator: checkUsername, trigger: 'blur' },
            { min: 2, max: 10, message: '长度在 2 到 10 个字符', trigger: 'blur' }
          ]
        },
        uploadPwdDlgVisibility: false,
        pwdObj: {
          password: '',
          code: ''
        },
        time: 60,
        canGetCode: false,
      }
    },
    methods: {
      getUserInfo() {
        this.$http.get('/user/getinfo').then(
          res => {
            if(res) {
              this.userInfo = res.data.obj
              this.newUsername.userName = this.userInfo.userName
            }
          }
        )
      },
      updateUsername() {
        this.$refs['usernameRef'].validate((valid) => {
          if(valid) {
            this.$http.post('/user/updateusername', this.newUsername).then(
              res => {
                if(res) {
                  res
                  this.$message.success('修改成功')
                  this.reload()
                }
              }
            )
          }
        })
      },
      sendSMS() {
        this.$http.post('/user/getsms', {phone: this.userInfo.userPhone}).then(
          res => {
            if(res) {
              this.$message({
                type: "success",
                message: '发送成功'
              })
              // 成功开始计时
              this.canGetCode = true
              let timer = 60
              let auth_timer = setInterval(() => {
                timer--; // 递减时间
                this.time = timer
                if (timer <= 0) {
                  this.canGetCode = false; // 60s时间结束还原状态并清除定时器
                  this.time = 60 // 防止下一次点击显示0
                  clearInterval(auth_timer)
                }
              }, 1000)
            }
          }
        )
      },
      updatePassword() {
        const obj = {
          code: this.pwdObj.code,
          password: this.$md5(this.pwdObj.password)
        }
        this.$http.post('/user/updatepassword', obj).then(
          res => {
            if(res) {
              this.$message({
                type: "success",
                message: '修改成功'
              })
              this.pwdObj = {}
              this.uploadPwdDlgVisibility = false
            }
          }
        )
      }
    },
    created () {
      this.getUserInfo()
      
    },
  }
</script>

<style lang="less" scoped>
.persaonal-setting {
  text-align: left;
  .code-flex {
    display: flex;
    .code-ipt {
      flex: 4;
      margin-right: 10px;
    }
    .code-btn {
      flex: 1
    }
  }
}
</style>