<!--
 * @Date: 2020-10-08 12:24:08
 * @LastEditors: 小枫
 * @LastEditTime: 2020-10-09 09:22:07
 * @FilePath: \book\src\components\PersonalInfo.vue
-->
<template lang="pug">
  .person-user-info
    div
      el-tooltip(placement="top", content="用户名")
        p
          i.el-icon-user
          span {{userInfo.userName}}
    div
      el-tooltip(placement="top", content="手机号码")
        p
          i.el-icon-phone
          span {{userInfo.userPhone | hidePhone}}
    div
      el-tooltip(placement="top", :content="`源币数量:${userInfo.userCoin}`")
        p
          i.el-icon-coin
          span {{userInfo.userCoin}}
    div
      el-tooltip(placement="top", :content="userInfo.password === 'exist' ? '密码已设置' : '密码未设置'")
        p
          i(:class="{'el-icon-lock': userInfo.password === 'exist', 'el-icon-unlock': userInfo.password !== 'exist'}")
          span {{userInfo.password === 'exist' ? '已设置' : '未设置'}}
</template>

<script>
  export default {
    data() {
      return {
        userInfo: {}
      }
    },
    methods: {
      getUserInfo() {
        this.$http.get('/user/getinfo').then(
          res => {
            if(res) {
              // console.log(res);
              this.userInfo = res.data.obj
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
.person-user-info {
  text-align: left;
  margin-left: 20px;
  p {
    display:inline-block;
    text-align: left;
    i {
      font-size: 25px;
      color: #409eff;
      margin-right: 20px;
    }
  }
}
</style>