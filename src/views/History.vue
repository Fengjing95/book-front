<!--
 * @Date: 2020-11-10 13:40:14
 * @LastEditors: 小枫
 * @description: description
 * @LastEditTime: 2020-11-10 15:24:23
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
        el-timeline
          el-timeline-item(
            v-for="item in uploadList",
            :key="item.bookId"
            :timestamp='item.uploadDate | formatDate2',
            placement='top',
          )
            el-card
              .card
                el-image.book-image(fit="fill", :src="$photoHeader+item.image")
                div
                  h4.book-name(@click="goToBook(item.bookId)") {{item.bookName}}
                    span(style="color: #777777;") &nbsp;(作者：{{item.author}})
                  .earnings 获得收益{{parseInt((item.bookPrice/11)*10)}}源币
        el-pagination(
          background,
          hide-on-single-page
          layout="prev, pager, next",
          :page-count="uploadAllPageNumber",
          :reviewPageNum="uploadPageNumber",
          @current-change="uploadPageChange",
        )
      el-tab-pane
        span(slot="label")
          i.el-icon-s-finance
          .
            &nbsp;我的解锁
        p 2
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
        p 3
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

      },
      getReadList() {

      }
    },
    created () {
      this.getUploadList()
      this.getUnlock()
      this.getReadList()
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