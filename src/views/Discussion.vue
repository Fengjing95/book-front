<!--
 * @Date: 2020-10-12 09:59:58
 * @LastEditors: 小枫
 * @description: 书圈列表页面
 * @LastEditTime: 2020-10-15 19:32:42
 * @FilePath: \book\src\views\Discussion.vue
-->
<template lang="pug">
  .scroll-load(
    v-infinite-scroll="load",
    style="overflow:auto",
    infinite-scroll-disabled="disabled",
    infinite-scroll-distance=10,
    infinite-scroll-delay=1000,
    infinite-scroll-immediate=false,
    ref="scrollView"
  )
    .discussion
      //- 循环展示书圈Item
      DiscussionItem(
        v-for="item in discussionList",
        :key="item.bdId",
        :discussionObj="item",
      )
      .footer {{canLoading ? '加载中……' : '已经到底了'}}
</template>

<script>
import DiscussionItem from '../components/Discussion/DiscussionItem.vue';
  export default {
    components: {
      DiscussionItem,
    },
    data() {
      return {
        // 书圈列表data
        discussionList: [],
        pageNumber: 1,
        allPageNumber: null,
        loading: false,
        scrollTop: 0, // 滚动条位置
      }
    },
    computed: {
      disabled () {
        return !this.canLoading || this.loading
      },
      canLoading() {
        return this.pageNumber <= this.allPageNumber
      }
    },
    methods: {
      // 获取书圈List
      getDiscussionList() {
        this.loading = true
        this.$http.get(`/discussions/querydiscussion?pageNumber=${this.pageNumber}&pageSize=18`).then(
          res => {
            if(res) {
              this.discussionList.push(...res.data.obj.content)
              this.pageNumber++
              this.allPageNumber = res.data.obj.totalPages
              this.loading = false
            }
          }
        )
      },
      load() {
        if(this.canLoading) {
          this.getDiscussionList()
        }
      }
    },
    // keep-alive下created无效，改为activated
    created () {
      // 组件创建时标记为创建，防止详情界面刷新数据丢失无法刷新
      this.isEnter = true
    },
    // 导航守卫：如果是从书圈详情返回回来的设置isBack为true
    beforeRouteEnter(to, from, next) {
      if (from.name === 'Discussion') {
        to.meta.isBack = true;
      } else {
        to.meta.isBack = false;
      }
      next();
    },
    beforeRouteLeave(to,from,next){
      //离开页面时把滚动条位置存起来
      this.scrollTop = this.$refs.scrollView.scrollTop
      this.isEnter = false
      next()
    },
    activated() {
      // 不是从详情返回回来的重新加载页面
      if (!this.$route.meta.isBack || this.isEnter) {
        this.discussionList = []
        this.pageNumber = 1
        this.allPageNumber =  null
        this.loading = false
        this.scrollTop = 0
        this.getDiscussionList()
      } else {
        // 定位到上次保存的滚动条
        this.$refs.scrollView.scrollTop = this.scrollTop
      }
      this.$route.meta.isBack = false
    }
  }
</script>

<style lang="less" scoped>
.scroll-load {
  width: 100%;
  height: calc(100vh - 61px);
  margin: 0 auto;
  &::-webkit-scrollbar {
    /*滚动条整体样式*/
    width: 10px; /*高宽分别对应横竖滚动条的尺寸*/
    height: 1px;
  }
  &::-webkit-scrollbar-thumb {
    /*滚动条里面小方块*/
    border-radius: 10px;
    background-color: skyblue;
    background-image: -webkit-linear-gradient(
      45deg,
      rgba(255, 255, 255, 0.2) 25%,
      transparent 25%,
      transparent 50%,
      rgba(255, 255, 255, 0.2) 50%,
      rgba(255, 255, 255, 0.2) 75%,
      transparent 75%,
      transparent
    );
  }
  &::-webkit-scrollbar-track {
    /*滚动条里面轨道*/
    box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
    background: #ededed;
    border-radius: 10px;
  }
  .discussion {
    text-align: left;
    width: 1000px;
    margin: 10px auto;
    display: flex;
    flex-wrap: wrap;
    // justify-content: space-between;
  }
  .footer {
    text-align: center;
    color: #777;
    position: relative;
    bottom: -5px;
    right: -50%;
    transform: translateX(-50%);
  }
}
</style>
