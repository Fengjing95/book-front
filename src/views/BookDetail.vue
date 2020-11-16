<!--
 * @Date: 2020-11-09 09:54:00
 * @LastEditors: 小枫
 * @description: 书籍详情
 * @LastEditTime: 2020-11-16 20:36:31
 * @FilePath: \book\src\views\BookDetail.vue
-->
<template lang="pug">
.book-detail
  .book-info
    s {{ book.typeName }}
    .book-info-left
      el-image.book-image(fit="fill", :src="bookImgSrc")
      img.shadow(src="../assets/image/shadow.gif")
    .book-info-right
      .book-name-about.pad
        .name {{ book.bookName }}
        .about
          span.sty 作者:{{ book.author }}
          span.sty 出版社:{{ book.publisher }}
          span 出版时间:{{ book.publishDate | formatDate2 }}
      .book-lock-mobile.pad
        .left
          .price 价格<span style="color: #777;">(整本)</span>：{{ book.bookPrice }}源币
          // TODO：阅读
          .btn
            a(:href="`/api/download/download?bookId=${bookId}&token=${$store.getters.getToken}`" :download="book.bookName+'.pdf'")
              el-button(
                size="small",
                type="success",
                :disabled="!book.bookState || !isAllUnlock",
                @click="download"
              ) 下载至本地
            el-button(
              size="small",
              type="danger",
              :disabled="!book.bookState",
              @click="unlockVisiable = true",
              style="margin-left: 10px"
            ) 开始阅读
            el-button(
              size="small",
              :type="!collection ? 'default' : 'primary'",
              :icon="!collection ? 'el-icon-star-off' : 'el-icon-star-on'",
              @click="collectionHandle",
              :disabled="!collection && !book.bookState"
            ) {{ !collection ? '收藏' : '已收藏' }}
        .right
          // TODO 小程序码
          el-image.mobile(
            fit="fill",
            src="http://www.ireader.com/index.php?ca=bookdetail.AppOpenQr&bid=10889522"
          )
      .book-thanks.pad
        .user-upload(v-if="contributor.userId !== 1")
          img.medal(src="../assets/svg/medal.svg")
          el-avatar(:size="50", :src="userImgSrc")
          .thanks-name {{ contributor.userName }}
          .thanks-content 👆本资源由上述用户上传，感谢对本站的大力支持
        .admin-upload(v-else)
          p(style="font-size: 14px; color: #777;") 由书源网整理发布，如果侵犯了您的版权请联系我们
        el-button(
          style="float: right;",
          size="mini",
          :type="bookDiscussion !== 0 ? 'primary' : 'success'",
          @click="handleBookDiscussion",
          :disabled="bookDiscussion === 0 && !book.bookState"
        ) {{ bookDiscussion !== 0 ? '去书圈看看' : '创建书圈' }}
  .review-recommend
    .review-list
      .show-star
        .star-text
          span(style="margin-right: 20px") 累计评价 {{ totalReviews }}
          span 综合评价
        el-rate.star(
          v-model="value",
          disabled,
          show-score,
          text-color="#ff9900",
          score-template="{value}"
        )
        el-button(
          size="mini",
          type="primary",
          @click="reviewVisiable = true",
          :disabled="isReviewed || !book.bookState"
        ) 我也说两句
      .review(v-if="reviewList.length !== 0")
        book-review(
          v-for="(item, index) in reviewList",
          :key="index",
          :reviewObj="item"
        )
      .no-review(v-else)
        h5(style="color: #777;") 还没有人评价过呢
      el-pagination(
        background,
        hide-on-single-page,
        layout="prev, pager, next",
        :page-count="allPageNumber",
        :reviewPageNum="pageNumber",
        @current-change="currentPageChange"
      )
    .recommend-list
      .r-title 推荐你看
  el-dialog(
    title="满意度评价",
    :visible.sync="reviewVisiable",
    close-on-click-modal=false,
    top="20vh",
    :destroy-on-close="true",
    show-close,
    width="500px"
  )
    el-form(
      ref="uploadForm",
      :model="satisfaction",
      :rules="rules",
      size="medium",
      label-width="100px"
    )
      el-form-item(label="评分", prop="value", style="text-align: left;")
        el-rate(v-model="satisfaction.value", show-text="", :colors="colors")
      el-form-item(label="多行文本", prop="reviewContent")
        el-input(
          v-model="satisfaction.reviewContent",
          type="textarea",
          placeholder="请输入文字评价",
          :maxlength="255",
          :autosize="{ minRows: 2, maxRows: 3 }",
          :style="{ width: '100%' }"
        )
    div(slot="footer")
      el-button(@click="reviewVisiable = false") 取消
      el-button(type="primary", @click="submitReview") 确定
  el-dialog(
    title="创建书圈",
    :visible.sync="createBookDiscussionVisiable",
    close-on-click-modal=false,
    top="20vh",
    :destroy-on-close="true",
    show-close
  )
    el-form(
      ref="createBookDiscussionFormRef",
      :model="createBookDiscussionForm",
      :rules="rules2",
      size="medium",
      label-width="100px"
    )
      el-form-item(label="书圈名", prop="dbName")
        el-input(
          v-model="createBookDiscussionForm.dbName",
          placeholder="请输入书圈名",
          :maxlength="20",
          clearable="",
          :style="{ width: '100%' }"
        )
      el-form-item(label="描述", prop="dbDes")
        el-input(
          v-model="createBookDiscussionForm.dbDes",
          type="textarea",
          placeholder="请输入描述",
          :maxlength="255",
          :autosize="{ minRows: 2, maxRows: 3 }",
          :style="{ width: '100%' }"
        )
    div(slot="footer")
      el-button(@click="createBookDiscussionVisiable = false") 取消
      el-button(type="primary", @click="createDiscussion") 确定
  el-dialog(
    title="开始阅读",
    :visible.sync="unlockVisiable",
    close-on-click-modal=false,
    top="20vh",
    :destroy-on-close="true",
    show-close,
    width="600px"
  )
    .history-read 上次阅读到：{{historyRead}}
    //- 部分解锁
    .part
      el-button.btn(
        v-for="index in part",
        :key="index",
        size="small",
        :disabled="(unlockPart < index && !isAllUnlock) || !book.bookState"
      )
        //- XXX-> 解锁部分的判断
        i.el-icon-lock(v-if="unlockPart < index && !isAllUnlock")
        i.el-icon-unlock(v-else)
        span.con {{index !== part ? (index - 1) * 100 + 1 + '—' + index * 100 : (index - 1) * 100 + 1 + '—' + book.bookPage }}
    .operation
      el-button(
        style="width: 100px",
        type="success",
        size="small",
        :disabled="!book.bookState",
        @click="freeRead"
      ) 试读
      el-button(
        style="width: 100px",
        type="warning",
        size="small",
        :disabled="!book.bookState || isAllUnlock",
        @click="unlockNextPart"
      ) 解锁下一部分
      el-button(
        style="width: 100px;position: relative;",
        type="danger",
        size="small",
        :disabled="!book.bookState || isAllUnlock",
        @click="unlockAll"
      ) 全部解锁
        .yh
</template>

<script>
import BookReview from "../components/Review/BookReview";
export default {
  inject: ["reload"],
  props: {
    bookId: String,
  },
  components: {
    BookReview,
  },
  data() {
    return {
      // 小程序码
      src:
        "http://book.img.ireader.com/idc_1/m_1,w_156,h_208,q_100/e1c9fe3c/group6/M00/6C/9B/CmQUNlauC5uETavmAAAAANzPruo172792771.jpg?v=Qr4Ki2iQ",
      book: {},
      contributor: {},
      userImgSrc: "",
      bookImgSrc: "",
      satisfaction: {
        value: 0,
        reviewContent: "",
      },
      rules: {
        value: [
          {
            required: true,
            message: "评分不能为空",
            trigger: "change",
          },
        ],
        reviewContent: [
          {
            required: true,
            message: "请输入文字评价",
            trigger: "blur",
          },
        ],
      },
      rules2: {
        dbName: [
          {
            required: true,
            message: "请输入书圈名",
            trigger: "blur",
          },
        ],
        dbDes: [
          {
            required: true,
            message: "请输入描述",
            trigger: "blur",
          },
        ],
      },
      colors: ["#99A9BF", "#F7BA2A", "#FF9900"],
      reviewVisiable: false,
      value: 0,
      reviewList: [],
      pageNumber: 1,
      allPageNumber: null,
      totalReviews: "",
      isReviewed: false,
      bookDiscussion: 0,
      createBookDiscussionForm: {
        discussionCover: "",
        bookId: "",
        dbName: "",
        dbDes: "",
      },
      createBookDiscussionVisiable: false,
      collection: false,
      // 解锁相关
      unlockVisiable: false,
      isAllUnlock: false,
      unlockPart: 0,
      historyRead: 0
    };
  },
  computed: {
    part() {
      // 计算总的部分
      return Math.ceil(this.book.bookPage / 100) || 0
    },
  },
  methods: {
    handleBookDiscussion() {
      // 书圈按钮控制器
      if (this.bookDiscussion !== 0) {
        this.$router.push(`/discussion/${this.bookDiscussion}`);
      } else {
        this.createBookDiscussionForm.bookId = this.bookId;
        this.createBookDiscussionForm.discussionCover = this.book.image;
        this.createBookDiscussionVisiable = true;
      }
    },
    currentPageChange(val) {
      this.pageNumber = val;
      this.getReviewList();
    },
    getBookInfo() {
      // 获取书籍信息
      this.$http
        .get(`/book/querybookinfo?bookId=${this.bookId}`)
        .then((res) => {
          if (res) {
            // console.log(res);
            this.book = res.data.obj;
            this.contributor = res.data.obj.user;
            this.userImgSrc = this.$photoHeader + this.contributor.image;
            this.bookImgSrc = this.$photoHeader + this.book.image;
            this.value = res.data.obj.value;
            this.isReviewed = res.data.obj.myReview;
            this.bookDiscussion = res.data.obj.discussionId;
            this.collection = res.data.obj.myCollection;
            if (!this.book.bookState) {
              this.$message.info("书籍已下架");
            }
          }
        });
    },
    getReviewList() {
      // 获取评论列表
      this.$http
        .get(
          `/bookreview/querybookreview?bookId=${this.bookId}&pageNumber=${this.pageNumber}&pageSize=15`
        )
        .then((res) => {
          if (res) {
            // console.log(res);
            this.reviewList = res.data.obj.content;
            this.allPageNumber = res.data.obj.totalPages;
            this.totalReviews = res.data.obj.totalSize;
          }
        });
    },
    submitReview() {
      // 提交评论
      this.$refs["uploadForm"].validate((valid) => {
        if (!valid) return;
        if (this.satisfaction.value === 0) {
          this.$message.error("请选择星级评价");
          return;
        }
        const reviewObj = { ...this.satisfaction };
        reviewObj.bookId = this.bookId;
        this.$http.post("/bookreview/postreview", reviewObj).then((res) => {
          if (res) {
            this.reviewVisiable = false;
            this.$message.success("发布成功");
            this.reload();
          }
        });
      });
    },
    createDiscussion() {
      // 创建书圈
      this.$refs["createBookDiscussionFormRef"].validate((valid) => {
        if (!valid) return;
        this.$http
          .post("/discussions/adddiscussion", this.createBookDiscussionForm)
          .then((res) => {
            if (res) {
              console.log(res);
              this.createBookDiscussionVisiable = false;
              this.bookDiscussion = res.data.obj;
              this.$confirm("书圈创建完成，前往查看?", "创建成功", {
                confirmButtonText: "瞅一眼",
                cancelButtonText: "稍后在看",
                type: "success",
              })
                .then(() => {
                  this.$router.push(`/discussion/${this.bookDiscussion}`);
                })
                .catch(() => {});
            }
          });
      });
    },
    collectionHandle() {
      // 收藏控制器
      if (this.collection) {
        this.collectionOff();
      } else {
        this.collectionOn();
      }
    },
    collectionOn() {
      // 添加收藏
      this.$http.get(`/collection/on?bookId=${this.bookId}`).then((res) => {
        if (res) {
          this.collection = true;
        }
      });
    },
    collectionOff() {
      // 取消收藏
      this.$http.get(`/collection/off?bookId=${this.bookId}`).then((res) => {
        if (res) {
          this.collection = false;
        }
      });
    },
    getUnlockInfo() {
      // 查询书籍解锁信息
      this.$http.get(`/limit/querylimit?bookId=${this.bookId}`).then(
        res => {
          if(res) {
            // console.log(res);
            this.isAllUnlock = res.data.obj.limitAll
            this.unlockPart = res.data.obj.limitPage
            this.historyRead = res.data.obj.nowPage
          }
        }
      )
    },
    unlockAll() {
      // 全本解锁
      this.$confirm('将会扣除源币解锁全本书籍, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'info'
      }).then(() => {
        this.$http.get(`/limit/alllimit?bookId=${this.bookId}`).then(
          res => {
            if(res) {
              // console.log(res);
              this.getUnlockInfo()
              this.$message.success('解锁成功')
            }
          }
        )
      }).catch(() => {})
    },
    unlockNextPart() {
      // 解锁下一部分
      this.$confirm('将会扣除源币解锁下一部分书籍, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'info'
      }).then(() => {
        this.$http.get(`/limit/partlimit?bookId=${this.bookId}`).then(
          res => {
            if(res) {
              // console.log(res);
              this.getUnlockInfo()
              this.$message.success('解锁成功')
            }
          }
        )
      }).catch(() => {})
    },
    freeRead() {
      // 免费试读
    },
    download() {
      // 下载文件(弃用)
      // this.$http.post(`/download/download?bookId=${this.bookId}`, {}, {responseType: 'blob'}).then(
      //   res => {
      //     if(res) {
      //       return res.data
      //     }
      // }).then(res=>{
      //   const blob = new Blob([res],{type: "application/octet-stream"});
      //   const fileName = this.book.bookName + '.pdf'
      //   if (window.navigator.msSaveOrOpenBlob) {//msSaveOrOpenBlob方法返回bool值
      //     navigator.msSaveBlob(blob, fileName);//本地保存
      //   } else {
      //     const link = document.createElement('a');//a标签下载
      //     link.href = window.URL.createObjectURL(blob);
      //     link.download = fileName
      //     link.click();
      //     window.URL.revokeObjectURL(link.href);
      //   }
      // })
      // location.href = '/api/download/download?bookId=20'
    }
  },
  created() {
    this.getBookInfo()
    this.getReviewList()
    this.getUnlockInfo()
  },
};
</script>

<style lang="less" scoped>
.book-detail {
  width: 1000px;
  margin: 0 auto;
  .book-info {
    background-color: #fff;
    height: 356px;
    position: relative;
    display: flex;
    s {
      background: url("../assets/image/sjIcon.png") no-repeat;
      background-position: 0 0;
      width: 65px;
      height: 23px;
      line-height: 18px;
      position: absolute;
      top: 0;
      left: 0;
      margin: 20px 0 0 -5px;
      color: #fff;
      padding-left: 20px;
      text-decoration: none;
      font-size: 13px;
    }
    .book-info-left {
      width: 269px;
      height: 100%;
      border-right: solid 1px #f0f0f0;
      .book-image {
        margin-top: 68px;
        width: 156px;
        height: 208px;
        z-index: 3;
      }
      .shadow {
        position: relative;
        top: -14px;
      }
    }
    .book-info-right {
      width: 729px;
      text-align: left;
      .pad {
        padding: 20px 30px;
      }
      .book-name-about {
        border-bottom: solid 1px #f0f0f0;
        .name {
          max-width: 438px;
          height: 25px;
          font-size: 20px;
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
        }
        .about {
          max-width: 715px;
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
          margin-top: 15px;
          font-size: 12px;
          color: #777777;
          .sty {
            margin-right: 15px;
          }
        }
      }
      .book-lock-mobile {
        display: flex;
        .left {
          flex: 1;
          .price {
            font-size: 13px;
          }
          .btn {
            margin-top: 20px;
          }
        }
        .right {
          max-height: 83px;
          .mobile {
            width: 83px;
            height: 83px;
            object-fit: cover;
          }
        }
      }
      .book-thanks {
        border-top: solid 1px #f0f0f0;
        .medal {
          width: 30px;
          height: 30px;
          position: relative;
          top: -10px;
          margin-right: 10px;
        }
        .thanks-name {
          display: inline-block;
          position: relative;
          top: -13.8px;
          right: -20px;
        }
        .thanks-content {
          margin-left: 60px;
          color: #777777;
          font-size: 14px;
        }
      }
    }
  }
  .review-recommend {
    margin-top: 25px;
    background-color: #fafafa;
    display: flex;
    .review-list {
      background-color: #fff;
      width: 694px;
      border-right: solid 1px #f0f0f0;

      .show-star {
        padding: 30px 40px;
        display: flex;
        border-bottom: solid 1px #f0f0f0;
        .star-text {
          font-size: 14px;
          margin-right: 10px;
          line-height: 28px;
        }
        .star {
          position: relative;
          top: 4px;
          flex: 1;
          text-align: left;
        }
      }
    }
    .recommend-list {
      padding: 20px;
      .r-title {
        font-size: 18px;
      }
    }
  }
  .history-read {
    text-align: right;
    font-size: 14px;
    color: #777777;
  }
  .part {
    text-align: left;
    display: flex;
    flex-wrap: wrap;
    .con {
      display: inline-block;
      width: 52.04px
    }
    .btn {
      margin-top: 10px;
      &:nth-child(1) {
        margin-left: 10px;
      }
    }
  }
  .operation {
    margin-top: 20px;
    .yh {
      background: url('../assets/svg/youhui.svg');
      width: 25px;
      height: 25px;
      position: absolute;
      top: -1px;
      right: -1px;
    }
  }
}
</style>