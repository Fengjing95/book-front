<!--
 * @Date: 2020-10-06 09:34:01
 * @LastEditors: 小枫
 * @LastEditTime: 2020-10-09 09:25:11
 * @FilePath: \book\src\views\Personal.vue
-->
<template lang="pug">
.personal
  .header-show
    el-upload.avatar-uploader(
      action="/api/user/imageupload/",
      :show-file-list="false",
      :on-success="handleAvatarSuccess",
      :before-upload="beforeAvatarUpload",
      :headers="{ authorization: token }",
      :on-error="handleAvatarFailed",
    )
      img.avatar(v-if="imageUrl", :src="imageUrl")
      i.el-icon-plus.avatar-uploader-icon(v-else)
    .avatar-des
      p 点击更换
    .title-name
      h2 {{userInfo.userName}}
  .tips-text
    h2 个人资料
  .personal-content
    el-container
      el-aside.aside(width="196px")
        el-menu(:default-active="defaultRoute",router)
          el-menu-item(
            v-for="item in routeObj",
            :key="item.route",
            :index="item.route",
          ) {{item.menuItem}}
      //- el-divider(direction="vertical")
      el-container
        el-header
          .header-title 
            i(:class="$route.meta.subtitleIcon", style="margin-right: 10px;") 
            span {{$route.meta.subtitle}}
        el-main
         router-view/
</template>

<script>
export default {
  inject: ['fresh'],
  data() {
    return {
      userInfo: {},
      token: localStorage.getItem("token"),
      imageUrl: window.localStorage.getItem('userPhoto'),
      routeObj: [
        {menuItem: '我的信息', route: '/personal'},
        {menuItem: '我的阅历', route: '/personal/record'},
        {menuItem: '编辑信息', route: '/personal/setting'},
      ]
    };
  },
  computed: {
    defaultRoute() {
       return this.$route.path
    }
  },
  methods: {
    // 获取用户信息
    getUserInfo() {
      this.$http.get('/user/getinfo').then(
        res => {
          if(res) {
            this.userInfo = res.data.obj
          }
        }
      )
    },
    // 上传失败回调
    handleAvatarFailed(error) {
      // 提取状态码
      const err = error.toString()
      const code = err.match(/[4|5]0[0-9]$/)
      switch(parseInt(code)) {
        case 403:
          this.$message.error('token过期或被篡改请重新登陆')
          window.localStorage.clear()
          this.$store.commit('freshToken')
          this.$router.push('/')
          break
        case 406:
          this.$message.error('保存失败，建议重新登陆再试')
          break
        default:
          this.$message.error('连接服务器失败')
          break
      }
    },
    // 上传成功回调
    handleAvatarSuccess(res, file) {
      this.$message.success('更换头像成功')
      this.imageUrl = URL.createObjectURL(file.raw)
      window.localStorage.setItem('userPhoto', this.$photoHeader + res.obj)
      this.fresh()
      // console.log(res)
    },
    // 上传前检查
    beforeAvatarUpload(file) {
      const isImg = file.type === "image/jpeg" || file.type === "image/png"
      const isLt5M = file.size / 1024 / 1024 < 5;

      if (!isImg) {
        this.$message.error("上传头像图片只能是 JPG/PNG 格式!")
      }
      if (!isLt5M) {
        this.$message.error("上传头像图片大小不能超过 5MB!")
      }
      return isImg && isLt5M
    },
  },
  created() {
    this.getUserInfo()
  }
};
</script>

<style lang="less">
.personal {
  width: 1000px;
  margin: 0 auto;
  .header-show {
    margin-top: 1px;
    width: 1000px;
    height: 300px;
    position: relative;
    &::before {
      content: "";
      position: absolute;
      top: 0;
      left: 0;
      width: 1000px;
      height: 300px;
      background: transparent url("../assets/image/person-header-show.jpg")
        center center no-repeat;
      box-sizing: border-box;
      filter: blur(2px);
      z-index: -1;
    }
    .avatar-uploader {
      position: absolute;
      top: 50%;
      left: 10%;
      transform: translateY(-50%);
      .el-upload {
        background-color: #f5f5f5;
        border: 1px dashed #d9d9d9;
        border-radius: 6px;
        cursor: pointer;
        position: relative;
        overflow: hidden;
        &:hover {
          border-color: #409eff;
        }
      }
      .avatar-uploader-icon {
        font-size: 28px;
        color: #8c939d;
        width: 148px;
        height: 148px;
        line-height: 148px;
        text-align: center;
      }
      .avatar {
        width: 148px;
        height: 148px;
        display: block;
        object-fit: cover;
      }
    }
    .avatar-des {
      pointer-events: none;
      width: 150px;
      position: absolute;
      top: 70%;
      left: 10%;
      transform: translateY(-50%);
      p {
        color: #f5f5f5;
        background-color: rgba(0, 0, 0, 0.4);
        font-size: 13px;
      }
    }
    .title-name {
      position: absolute;
      top: 50%;
      left: 40%;
      transform: translateY(-50%);
      h2 {
        color: #f5f5f5;
      }
    }
  }
  .tips-text {
    height:53.5px;
    border-bottom: solid 2px #777;
    h2 {
      float: left;
      border-bottom: solid 2px #409eff;
      padding: 0 50px
    }
  }
  .personal-content {
    margin-top: 20px;
    clear: both;
    .header-title {
      text-align: left;
      background-color: #f5f5f5;
      padding: 10px 20px;
    }
  }
}
</style>
