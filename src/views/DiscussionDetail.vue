<!--
 * @Date: 2020-10-13 19:50:51
 * @LastEditors: 小枫
 * @description: 书圈卡片组件
 * @LastEditTime: 2020-11-04 15:10:42
 * @FilePath: \book\src\views\DiscussionDetail.vue
-->
<template lang="pug">
  .discussion-detail(ref="bdScrollView")
    .bread-crumb
      el-breadcrumb(separator="/", style="width: 872px;display: inline-block;")
        el-breadcrumb-item(:to={path: '/discussion'}) 书圈
        el-breadcrumb-item {{bdInfo.bdName}}
      el-button(
        type="primary",
        style="display: inline-block;",
        :disabled="!isIn || isBanned",
        @click="$router.push(`/editor/${bdId}`)"
      ) 发布动态
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
          :isBanned="isBanned",
          :myId="myId"
        )
        div(v-if="pageNumber<allPageNumber")
          el-button(type="text", @click="getDynamicList") 加载更多
        div(v-else)
          el-button(type="text", disabled) 已经到底了
      .user
        p(style="border-bottom: solid 1px #e6e6e6;line-height: 30px") 圈友列表
        .user-list(v-if="friendsList.length > 0")
          .user-item(v-for="(item, index) in friendsList", :key="index")
            el-tooltip(:content="item.userName", :open-delay=300 )
              el-avatar(:size=50,:src="$photoHeader+item.userPhoto")
        p(v-else, style="color: #777;") 快来做第一个圈友吧
        div(v-if="!isAllFriends")
          el-button(type="text", @click="showMore") 显示更多
        div(v-else)
          el-button(type="text", disabled) 已经显示全部了
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
        dynamicList: [],
        isAllFriends: false,
        friendsList: [],
        pageNumber: 1,
        allPageNumber: 1,
        isBanned: false,
        myId: null,
      }
    },
    methods: {
      // 展示更多
      showMore() {
        this.isAllFriends = true
        this.getFriendsList()
      },
      // 获取书圈详情
      getDiscussionDetail() {
        this.$http.get(`/discussions/querybyid?discussionId=${this.bdId}`).then(
          res => {
            if(res) {
              this.bdInfo = res.data.obj.obj
              this.people = res.data.obj.num
              this.isIn = res.data.obj.state
              this.isBanned = res.data.obj.isBanned
              // console.log(res);
              this.myId = res.data.obj.myId
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
              this.getFriendsList()
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
                this.getFriendsList()
              }
            }
          )
        })
      },
      // 获取圈友列表
      getFriendsList() {
        let limit = 20;
        if(this.isAllFriends) {
          limit = 0
        }
        this.$http.get(`/bduser/queryuser?bdId=${this.bdId}&limit=${limit}`).then(
          res => {
            if(res) {
              this.friendsList = res.data.obj
            }
          }
        )
      },
      // 获取动态List
      getDynamicList() {
        this.$http.get(`/dynamic/querydynamic?bdId=${this.bdId}&pageNumber=${this.pageNumber}&pageSize=10`).then(
          res => {
            if(res) {
              console.log(res);
              this.dynamicList.push(...res.data.obj.content)
              this.allPageNumber = res.data.obj.totalPages
              this.pageNumber++
            }
          }
        )
      },
    },
    created () {
      // 组件创建时获取书圈详情
      // this.getDiscussionDetail()
      this.bdEnter = true
    },
    beforeRouteEnter(to, from, next) {
      if (from.name === 'Dynamic') {
        to.meta.isBack = true
      } else {
        to.meta.isBack = false
      }
      // 需要重新刷新
      if(to.meta.needReload) {
        to.meta.isBack = false
      }
      next()
    },
    beforeRouteLeave(to, from, next) {
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
        this.isAllFriends = false
        this.dynamicList = []
        this.bdScrollTop = 0
        this.pageNumber = 1
        this.getDiscussionDetail()
        this.getFriendsList()
        this.getDynamicList()
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
      .user-list {
        display: flex;
        flex-wrap: wrap;
        .user-item {
          margin: 10px calc(95px / 8);
        }
      }
    }
  }
}
</style>
