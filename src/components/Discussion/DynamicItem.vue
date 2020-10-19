<!--
 * @Date: 2020-10-15 09:22:54
 * @LastEditors: 小枫
 * @description: 动态组件
 * @LastEditTime: 2020-10-19 20:26:16
 * @FilePath: \book\src\components\Discussion\DynamicItem.vue
-->
<template lang="pug">
  div
    .dynamic-item
      el-avatar.dy-avatar(:src="$photoHeader+dynamicObj.user.image", :size=50 )
      .dy-detail(class="clearfix")
        .nickname {{dynamicObj.user.userName}}
        .dy-time {{dynamicObj.ddate | intervalTime}}
        .overflow(class="dy-content") {{dynamicObj.dabstract}}
        .check-detail
          el-button(type="text",@click="$router.push(`/dynamic/${dynamicObj.did}`)") 查看详情
    .footer-btn
      .to-report(@click="toReport")
        i.el-icon-warning-outline 
        .btn-text 举报
      .review(@click="review")
        i.el-icon-chat-dot-round
        .btn-text {{reviewNum}}
      .give-like(:class="{active: isLike}", @click="like")
        i.el-icon-sunny
        .btn-text {{likeNum}}
</template>

<script>
// 动态组件
  export default {
    props: {
      dynamicObj: Object
    },
    data() {
      return {
        // 是否点赞
        isLike: this.dynamicObj.like,
        likeNum: this.dynamicObj.likeNum,
        reviewNum: this.dynamicObj.reviewsNum
      }
    },
    methods: {
      like() {
        if(this.isLike) {
          this.cancelLike()
        } else {
          this.giveLike()
        }
      },
      cancelLike() {
        this.$http.get(`/givelike/cancellike?dynamicId=${this.dynamicObj.did}`).then(
          res => {
            if(res) {
              this.isLike = res.data.obj.isLike
              this.likeNum = res.data.obj.likeNum
            }
          }
        )
      },
      giveLike() {
        this.$http.get(`/givelike/givelike?dynamicId=${this.dynamicObj.did}`).then(
          res => {
            if(res) {
              this.isLike = res.data.obj.isLike
              this.likeNum = res.data.obj.likeNum
            }
          }
        )
      },
      toReport() {
        console.log('to report');
      },
      review() {
        // TODO发布评论
        this.$prompt('请输入评论内容', '评论', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          inputPattern: /[\s\S]{1,255}/,
          inputErrorMessage: '字数限制1-255'
        }).then(({ value }) => {
          console.log(value);
          
        }).catch(() => {})
      }
    },
  }
</script>

<style lang="less" scoped>
.dynamic-item {
  padding: 20px 20px 4px 20px;
  position: relative;
  text-align: left;
  background-color: #ffffff;
  .dy-avatar {
    float: left;
  }
  .dy-detail {
    margin-left: 60px;
    // clear: both;
    .nickname {
      margin-top: 8px;
      font-size: 14px;
      font-weight: 700;
    }
    .dy-time {
      margin-top: 10px;
      font-size: 12px;
      color: #777;
    }
    .dy-content {
      height: 70px;
      overflow: hidden;
    }
    .check-detail {
      text-align: center;
    }
  }
}
.footer-btn {
  border-top: solid 1px #c9c9c9;
  height: 30px;
  margin-bottom: 10px;
  background-color: #ffffff;
  display: flex;
  &:hover {
    cursor: pointer;
  }
  i {
    line-height: 30px;
    font-size: 20px;
  }
  .btn-text {
    display: inline-block;
    line-height: 20px;
    font-size: 14px;
    position: relative;
    top: -2.5px;
    right: -3px;
  }
  .to-report {
    flex: 1;
    &:hover {
      color: #409eff;
    }
  }
  .review {
    flex: 1;
    border-left: solid 1px #c9c9c9;
    border-right: solid 1px #c9c9c9;
    &:hover {
      color: #409eff;
    }
  }
  .give-like {
    flex: 1;
    &:hover {
      color: #409eff;
    }
  }
  .active {
    color: #409eff;
  }
}
.clearfix {
  &::after {
    content: '';
    clear: both;
    visibility: hidden;
  }
}
.overflow {
  position: relative;
  &::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 70px;
    background: linear-gradient(rgba(255, 255, 255, 0),white); /* 溢出部分那显示渐变 */
    pointer-events: none;
  }
}
</style>