<!--
 * @Date: 2020-11-10 13:40:14
 * @LastEditors: 小枫
 * @description: description
 * @LastEditTime: 2020-11-17 09:31:55
 * @FilePath: \book\src\views\History.vue
-->
<template lang="pug">
  .history
    el-tabs(type="border-card")
      el-tab-pane
        span(slot="label")
          i.el-icon-upload
          .
            &nbsp;我的上传
        el-timeline(v-if="uploadList.length !== 0")
          el-timeline-item(
            v-for="item in uploadList",
            :key="item.bookId"
            :timestamp='item.uploadDate | formatDate2',
            placement='top',
          )
            el-card
              .card
                el-image.book-image(fit="fill", :src="$photoHeader+item.image", @click="goToBook(item.bookId)")
                div
                  h4.book-name(@click="goToBook(item.bookId)") {{item.bookName}}
                    span(style="color: #777777;") &nbsp;(作者：{{item.author}})
                  .earnings 获得收益{{parseInt((item.bookPrice/11)*10)}}源币
        div(v-else) 暂无上传记录
        el-pagination(
          background,
          hide-on-single-page,
          layout="prev, pager, next",
          :page-count="uploadAllPageNumber",
          :reviewPageNum="uploadPageNumber",
          @current-change="uploadPageChange",
          style="text-align: center;"
        )
      el-tab-pane
        span(slot="label")
          i.el-icon-s-finance
          .
            &nbsp;我的解锁
        el-timeline(v-if="unlockList.length !== 0")
          el-timeline-item(
            v-for="item in unlockList",
            :key="item.limitId"
            :timestamp='item.limitDate | formatDate2',
            placement='top',
          )
            el-card
              .card
                el-image.book-image(fit="fill", :src="$photoHeader+item.book.image", @click="goToBook(item.bookId)")
                div
                  h4.book-name(@click="goToBook(item.bookId)") {{item.book.bookName}}
                    span(style="color: #777777;") &nbsp;(作者：{{item.book.author}})
                  .earnings 解锁进度：
                    span(v-if="item.limitAll") 全本解锁
                    span(v-else) 第{{item.limitPage}}部分
        div(v-else) 暂无解锁记录
        el-pagination(
          background,
          hide-on-single-page
          layout="prev, pager, next",
          :page-count="unlockAllPageNumber",
          :reviewPageNum="unlockPageNumber",
          @current-change="unlockPageChange",
        )
      el-tab-pane
        span(slot="label")
          i.el-icon-s-management
          .
            &nbsp;我的阅读
        div 暂无阅读记录
        el-pagination(
          background,
          hide-on-single-page
          layout="prev, pager, next",
          :page-count="readAllPageNumber",
          :reviewPageNum="readPageNumber",
          @current-change="readPageChange",
        )
</template>

<script>
  export default {
    data() {
      return {
        uploadList: [],
        uploadPageNumber: 1,
        uploadAllPageNumber: undefined,
        unlockList: [],
        unlockPageNumber: 1,
        unlockAllPageNumber: undefined,
        readList: [],
        readPageNumber: 1,
        readAllPageNumber: undefined,
      }
    },
    methods: {
      goToBook(bookId) {
        // 跳转详情
        this.$router.push(`/book/${bookId}`)
      },
      uploadPageChange(val) {
        this.uploadPageNumber = val
      },
      unlockPageChange(val) {
        this.unlockPageNumber = val
      },
      readPageChange(val) {
        this.readPageNumber = val
      },
      getUploadList() {
        // 获取上传记录
        this.$http.get(`/book/queryupload?pageNumber=${this.uploadPageNumber}&pageSize=10`).then(
          res => {
            if(res) {
              // console.log(res);
              this.uploadList = res.data.obj.content
              this.uploadAllPageNumber = res.data.obj.totalPages
            }
          }
        )
      },
      getUnlock() {
        // 获取解锁记录
        this.$http.get(`/limit/queryhistory?pageNumber=${this.unlockPageNumber}&pageSize=10`).then(
          res => {
            if(res) {
              // console.log(res);
              this.unlockList = res.data.obj.content
              this.unlockAllPageNumber = res.data.obj.totalPages
            }
          }
        )
      },
      getReadList() {
        // TODO获取阅读记录
        this.$http.get(`/?pageNumber=${this.readPageNumber}&pageSize=10`).then(
          res => {
            if(res) {
              this.readList = res.data.obj.content
              this.readAllPageNumber = res.data.obj.totalPages
            }
          }
        )
      }
    },
    created () {
      this.getUploadList()
      this.getUnlock()
      // this.getReadList()
    },
  }
</script>

<style lang="less" scoped>
.history {
  background-color: #fff;
  margin: 0 auto;
  width: 1000px;
  text-align: left;
  .card {
    display: flex;
    .book-image {
      width: 78px;
      height: 104px;
      cursor: pointer;
      border: solid 1px #f0f0f0;
    }
    .book-name {
      margin-left: 20px;
      cursor: pointer;
    }
    .earnings {
      margin-left: 20px;
      color: #777777;
    }
  }
}
</style>