<!--
 * @Date: 2020-10-06 09:34:01
 * @LastEditors: 小枫
 * @LastEditTime: 2020-10-07 15:53:49
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
      :headers="{ authorization: token }"
    )
      img.avatar(v-if="imageUrl", :src="imageUrl")
      i.el-icon-plus.avatar-uploader-icon(v-else)
    .avatar-des
      p 点击更换
    .title-name
      h2 {{userInfo.name}}
  .info-content
    p 123
</template>

<script>
export default {
  inject: ['fresh'],
  data() {
    return {
      userInfo: {
        name: '屁哦里啪啦'
      },
      token: localStorage.getItem("token"),
      imageUrl: window.localStorage.getItem('userPhoto')
    };
  },
  methods: {
    getUserInfo() {},
    uploadUserInfo() {},
    uploadPassword() {},
    hasPassword() {},
    // 上传成功回调
    handleAvatarSuccess(res, file) {
      // console.log(res);
      this.imageUrl = URL.createObjectURL(file.raw)
      window.localStorage.setItem('userPhoto', this.$photoHeader + res.obj)
      // setTimeout(() => {
        this.fresh();
      // }, 1000)
    },
    // 上传前检查
    beforeAvatarUpload(file) {
      const isImg = file.type === "image/jpeg" || file.type === "image/png";
      const isLt5M = file.size / 1024 / 1024 < 5;

      if (!isImg) {
        this.$message.error("上传头像图片只能是 JPG/PNG 格式!");
      }
      if (!isLt5M) {
        this.$message.error("上传头像图片大小不能超过 5MB!");
      }
      return isImg && isLt5M;
    },
  },
  created() {}
};
</script>

<style lang="less">
.personal {
  width: 1000px;
  margin: 0 auto;
  .header-show {
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
}
</style>
