<!--
 * @Date: 2020-10-15 18:42:21
 * @LastEditors: 小枫
 * @description: 动态详情
 * @LastEditTime: 2020-10-19 09:01:48
 * @FilePath: \book\src\views\Dynamic.vue
-->
<template lang="pug">
  .dynamic
    .dynamic-info-bread
      el-breadcrumb(separator="/", style="width: 940px;display: inline-block;")
        el-breadcrumb-item(:to={path: '/discussion'}) 书圈
        el-breadcrumb-item(:to={path: `/discussion/${bdId}`}) {{bdName}}
        el-breadcrumb-item {{user.userName}}的动态
    .dynamic-info-user
      el-avatar.dynamic-info-user-avatar(:src="user.image", :size=50 )
      .name-and-date
        .dynamic-info-user-name {{user.userName}}
        .dynamic-info-user-date {{dynamic.ddate | intervalTime}}
      el-button.btn(
        v-if="isMine",
        type="text",
        @click="deleteDynamicById"
      ) 删除
    .markdown-body(class="content", v-html="dynamic.dcontent")

</template>

<script>
// TODO：评论,取消点赞、
  export default {
    props: {
      dynamicId: String
    },
    data() {
      return {
        dynamic: {},
        bdName: '',
        bdId: '',
        user:'',
        isMine: false,
        needReload: false,
      }
    },
    // computed: {
    //   username() {
    //     return this.dynamic.user.userName
    //   }
    // },
    methods: {
      getDynamicById() {
        this.$http.get(`/dynamic/querybyid?dynamicId=${this.dynamicId}`).then(
          res => {
            if(res) {
              // console.log(res);
              this.dynamic = res.data.obj.dynamic
              this.user = res.data.obj.dynamic.user
              this.user.image = this.$photoHeader+this.user.image
              this.isMine = res.data.obj.my
              return res.data.obj.dynamic.bdId
            }
          }
        ).then((res) => {
          this.$http.get(`/discussions/querybyid?discussionId=${res}`).then(
            res => {
              if(res) {
                this.bdName = res.data.obj.obj.bdName
                this.bdId = res.data.obj.obj.bdId
              }
            }
          )
        })
      },
      deleteDynamicById() {
        this.$http.get(`/dynamic/deletedynamic?dynamicId=${this.dynamicId}`).then(
          res => {
            if(res) {
              this.$message.success('删除成功')
              this.needReload = true
              this.$router.push(`/discussion/${this.bdId}`)
            }
          }
        )
      }
    },
    // 离开前设置是否需要刷新
    beforeRouteLeave (to, from, next) {
      if(this.needReload) {
        to.meta.needReload = true
      }
      next()
    },
    created () {
      this.getDynamicById()
    },
  }
</script>

<style lang="less" scoped>
.dynamic {
  width: 1000px;
  margin: 0 auto;
  background-color: #ffffff;
  
  box-sizing: border-box;
  text-align: left;
  .dynamic-info-bread {
    padding: 15px;
    border-bottom: solid 1px #e6e6e6;
  }
  .dynamic-info-user {
    padding: 20px 20px 4px 20px;
    .dynamic-info-user-avatar {
      display: inline-block;
    }
    .name-and-date {
      margin-left: 10px;
      display: inline-block;
      .dynamic-info-user-name {
              margin-top: 8px;
      font-size: 14px;
      font-weight: 700;
      }
      .dynamic-info-user-date {
        margin-top: 10px;
        font-size: 12px;
        color: #777;
      }
    }
    .btn {
      float: right;
    }
  }
  .content {
    padding: 20px;
  }
}
</style>