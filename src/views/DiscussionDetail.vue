<!--
 * @Date: 2020-10-13 19:50:51
 * @LastEditors: 小枫
 * @description: 书圈卡片组件
 * @LastEditTime: 2020-10-15 19:36:20
 * @FilePath: \book\src\views\DiscussionDetail.vue
-->
<template lang="pug">
  .discussion-detail(ref="bdScrollView")
    .bread-crumb
      el-breadcrumb(separator="/")
        el-breadcrumb-item(:to={path: '/discussion'}) 书圈
        el-breadcrumb-item {{bdInfo.bdName}}
    .bd-correlation
      el-avatar(
        :src="bdInfo.bdPhoto",
        shape="square",
        :size=100,
      )
      .bd-text
        h3
          span(style="color: #409eff") # 
          span {{bdInfo.bdName}} ({{people}}人)
        p(style="width: 700px; font-size: 13px;") {{bdInfo.bdDes}}
      el-button.btn(
        v-if="!isIn",
        type='primary',
        @click="joinDiscussion"
      ) 加入
      el-button.btn(v-else, @click="quitDiscussion") 已加入
    .dynamic-and-user
      .dynamic
        dynamic-item(
          v-for="item in dynamicList",
          :key="item.id"
          :dynamicObj="item",
        )
      .user
        p 圈友列表
</template>

<script>
import DynamicItem from '../components/Discussion/DynamicItem.vue';
  export default {
    props: {
      // 通过路由传参——书圈ID
      bdId: String
    },
    components: {
      DynamicItem,
    },
    data() {
      return {
        people: 0,
        bdInfo: {},
        isIn: false,
        dynamicList: [
          {
            id: 1,
            username: '123',
            date: 1602747419107,
            content: `掘友们，今天有没有过生日的，没有的话 我过 😂😂 （祝自己生日快乐🎂）
            历史上，yslow 曾经作为互联网开发的核心指标唯一评价工具，它的指标代表了核心指标。
            之后逐步出现了 lighthouse 等种种新工具平台和新检测模式。经过几十年发展已经有众多各式各样的性能工具，
            对应的指标也趋于通用。具体如何评价指标本身的代表性也逐渐成为问题，需要关注。
            到了 2018 年，Google 在 I/O 大会上提到，75% 的用户认为页面的加载速度，是决定他们交互体验的首要因素[1]。
            Ire Aderinokun (Google Web Expert) 在 2020 年 #PerfMatter 的分享上说，“一旦页面加载时间超过 5s，
            用户就有 90% 的可能放弃它。”[2]`
          },
          {
            id: 2,
            username: '123',
            date: 1602488184000,
            content: `掘友们，今天有没有过生日的，没有的话 我过 😂😂 （祝自己生日快乐🎂）
            历史上，yslow 曾经作为互联网开发的核心指标唯一评价工具，它的指标代表了核心指标。
            之后逐步出现了 lighthouse 等种种新工具平台和新检测模式。经过几十年发展已经有众多各式各样的性能工具，
            对应的指标也趋于通用。具体如何评价指标本身的代表性也逐渐成为问题，需要关注。
            到了 2018 年，Google 在 I/O 大会上提到，75% 的用户认为页面的加载速度，是决定他们交互体验的首要因素[1]。
            Ire Aderinokun (Google Web Expert) 在 2020 年 #PerfMatter 的分享上说，“一旦页面加载时间超过 5s，
            用户就有 90% 的可能放弃它。”[2]`
          },
          {
            id: 3,
            username: '123',
            date: 1602488184000,
            content: `123456789`
          }
        ]
      }
    },
    methods: {
      // 获取书圈详情
      getDiscussionDetail() {
        this.$http.get(`/discussions/querybyid?discussionId=${this.bdId}`).then(
          res => {
            if(res) {
              this.bdInfo = res.data.obj.obj
              this.people = res.data.obj.num
              this.isIn = res.data.obj.state
              // console.log(res);
              this.bdInfo.bdPhoto = this.$photoHeader+this.bdInfo.bdPhoto
            }
          }
        )
      },
      // 加入书圈
      joinDiscussion() {
        this.$http.get(`/bduser/join?bdId=${this.bdId}`).then(
          res => {
            if(res) {
              this.people = res.data.obj.num
              this.isIn = res.data.obj.state
              this.$message.success('加入成功')
            }
          }
        )
        
      },
      // 退出书圈
      quitDiscussion() {
        this.$confirm('此操作将退出书圈, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'error'
        }).then(() => {
          this.$http.get(`/bduser/exit?bdId=${this.bdId}`).then(
            res => {
              if(res) {
                this.people = res.data.obj.num
                this.isIn = res.data.obj.state
                this.$message.success('退出成功')
              }
            }
          )
        })
      },
      // 获取圈友列表
      getFriendsList() {
        this.$http.get(`/bduser/queryuser?bdId=${this.bdId}&limit=0`).then(
          res => {
            if(res) {
              console.log(res);
            }
          }
        )
        
      }
    },
    created () {
      // 组件创建时获取书圈详情
      this.getDiscussionDetail()
      this.bdEnter = true
    },
    // 未登录不能进入书圈详情，书圈详情需要token
    beforeRouteEnter: (to, from, next) => {
      if (from.name === 'Dynamic') {
        to.meta.isBack = true
      } else {
        to.meta.isBack = false
      }
      next()
    },
    beforeRouteLeave(to,from,next){
      //离开页面时把滚动条位置存起来
      this.bdScrollTop = this.$refs.bdScrollView.scrollTop
      this.bdEnter = false
      next()
    },
    activated() {
      // 不是从详情返回回来的重新加载页面
      if (!this.$route.meta.isBack || this.bdEnter) {
        this.people = 0
        this.bdInfo = {}
        this.isIn = false
        // this.dynamicList = []
        this.bdScrollTop = 0
        this.getDiscussionDetail()
        this.getFriendsList()
      } else {
        // 定位到上次保存的滚动条
        this.$refs.bdScrollView.scrollTop = this.bdScrollTop
      }
      this.$route.meta.isBack = false
    }
  }
</script>

<style lang="less" scoped>
.discussion-detail {
  width: 1000px;
  margin: 0 auto;
  
  .bread-crumb {
    background-color: #ffffff;
    padding: 15px;
    border-bottom: solid 1px #e6e6e6;
  }
  .bd-correlation {
    padding: 20px 40px;
    display: flex;
    position: relative;
    background-color: #ffffff;
    border-bottom: solid 1px #e6e6e6;
    .bd-text {
      padding-left: 20px;
      text-align: left;
      flex: 1;
    }
    .btn {
      height: 40px;
      position: absolute;
      top: 50%;
      right: 40px;
      transform: translateY(-50%);
    }
  }
  .dynamic-and-user {
    margin-top: 10px;
    position: relative;
    .dynamic {
      width: 695px;
      display: inline-block;
      vertical-align:top;
    }
    .user {
      margin-left: 10px;
      width: 295px;
      background-color: #ffffff;
      display: inline-block;
      vertical-align:top;
    }
  }
}
</style>
