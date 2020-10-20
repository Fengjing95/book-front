<!--
 * @Date: 2020-10-15 18:42:21
 * @LastEditors: 小枫
 * @description: 动态详情
 * @LastEditTime: 2020-10-20 15:48:41
 * @FilePath: \book\src\views\Dynamic.vue
-->
<template lang="pug">
  .dynamic
    .dynamic-info-bread
      el-breadcrumb(separator="/", style="flex: 1;")
        el-breadcrumb-item(:to={path: '/discussion'}) 书圈
        el-breadcrumb-item(:to="bd") {{bdName}}
        el-breadcrumb-item {{user.userName}}的动态
      .like-icon(:class="{active: dynamic.like}", @click="like")
        i.el-icon-sunny
        .btn-text {{dynamic.likeNum}}
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
    .review-box
      
      .publish-review
        el-avatar(
          shape="square",
          :size=50,
          :src="photo",
        )
        el-input(
          v-model="reviewContent",
          type="textarea",
          :rows="2",
          placeholder="快来发表你的看法吧",
          style="flex: 1;margin: 0 20px;"
        )
        el-button(
          type="primary",
          :disabled="reviewContent.length===0",
          @click="sendReview",
        ) 发布
          br
          span 评论
      .count-pagination
        h3 {{reviewCount}} 评论
        el-pagination.page(
          small,
          layout="prev, pager, next",
          :page-count="allReviewPageNum",
          :reviewPageNum="reviewPageNum",
          @current-change="currentPageChange"
        )
      my-review(
        v-for="item in review",
        :key="item.drId",
        :reviewObj="item",
        @refreshReview="getReviewList",
        :myId="myId",
        :isMine="isMine"
      )
        div(v-if="item.sonReview.length !== 0")
          my-review(
            v-for="item2 in item.sonReview",
            :key="item2.drId",
            :reviewObj="item2",
            style="background-color: #fafbfc;",
            @refreshReview="getReviewList",
            :myId="myId",
            :isMine="isMine"
          )
      el-pagination.pagination(
        background,
        layout="prev, pager, next",
        :page-count="allReviewPageNum",
        :reviewPageNum="reviewPageNum",
        @current-change="currentPageChange",
        hide-on-single-page
      )
</template>

<script>
import MyReview from '../components/MyReview.vue'
  export default {
    props: {
      dynamicId: String
    },
    components: {
      MyReview,
    },
    data() {
      return {
        dynamic: {},
        bdName: '',
        bdId: '',
        user:'',
        isMine: false,
        myId: null,
        needReload: false,
        review: [],
        reviewPageNum: 1,
        allReviewPageNum: null,
        reviewContent: '',
        reviewCount: null
      }
    },
    computed: {
      bd() {
        return '/discussion/' + this.bdId
      },
      photo() {
        return window.localStorage.getItem('userPhoto')
      }
    },
    watch: {
      reviewPageNum() {
        this.getReviewList()
      }
    },
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
              this.myId = res.data.obj.nowUser
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
        this.$confirm('此操作将永久删除该, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$http.get(`/dynamic/deletedynamic?dynamicId=${this.dynamicId}`).then(
            res => {
              if(res) {
                this.$message.success('删除成功')
                this.needReload = true
                this.$router.push(`/discussion/${this.bdId}`)
              }
            }
          )
        }).catch(() => {})
      },
      like() {
        if(this.dynamic.like) {
          this.cancelLike()
        } else {
          this.giveLike()
        }
      },
      cancelLike() {
        this.$http.get(`/givelike/cancellike?dynamicId=${this.dynamicId}`).then(
          res => {
            if(res) {
              this.dynamic.like = res.data.obj.isLike
              this.dynamic.likeNum = res.data.obj.likeNum
            }
          }
        )
      },
      giveLike() {
        this.$http.get(`/givelike/givelike?dynamicId=${this.dynamicId}`).then(
          res => {
            if(res) {
              this.dynamic.like = res.data.obj.isLike
              this.dynamic.likeNum = res.data.obj.likeNum
            }
          }
        )
      },
      getReviewList() {
        this.$http.get(`/dynamicreview/queryreviews?dId=${this.dynamicId}&pageNumber=${this.reviewPageNum}&pageSize=8`).then(
          res => {
            if(res) {
              // console.log(res);
              this.review = res.data.obj.content
              this.allReviewPageNum = res.data.obj.totalPages
              this.reviewCount = res.data.obj.totalSize
            }
          }
        )
      },
      currentPageChange(val) {
        this.reviewPageNum = val
      },
      sendReview() {
        const sendReviewObj = {
          reviewContent: this.reviewContent,
          dynamicId: this.dynamicId,
        }
        this.$http.post('/dynamicreview/releasereview', sendReviewObj).then(
          res => {
            if(res) {
              this.reviewContent = ''
              this.reviewPageNum = 1
              this.getReviewList()
            }
          }
        )
      },
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
      this.getReviewList()
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
    display: flex;
    padding: 20px;
    border-bottom: solid 1px #e6e6e6;
    .like-icon {
      // display: inline-block;
      .btn-text {
        display: inline-block;
        line-height: 20px;
        font-size: 14px;
        position: relative;
        top: -2.5px;
        right: -3px;
      }
    }
    .active {
      color: #409eff;
    }
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
    padding: 10px 20px;
  }
  .review-box {
    border-top: solid 1px #e6e6e6;
    padding: 20px;
    .publish-review {
      margin: 10px;
      width: 600px;
      display: flex;
    }
    .pagination {
      margin: 20px 0 0 0;
      text-align: center;
    }
    .count-pagination {
      display: flex;
      margin: 18.72px 0;
      .page {
        text-align: right;
        flex: 1;
        position: relative;
        bottom: -20px;
      }
    }
  }
}
</style>