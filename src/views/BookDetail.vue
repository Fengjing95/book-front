<!--
 * @Date: 2020-11-09 09:54:00
 * @LastEditors: 小枫
 * @description: description
 * @LastEditTime: 2020-11-09 21:36:08
 * @FilePath: \book\src\views\BookDetail.vue
-->
<template lang="pug">
  .book-detail
    .book-info
      s {{book.typeName}}
      .book-info-left
        el-image.book-image(fit="fill", :src="bookImgSrc")
        img.shadow(src="../assets/image/shadow.gif")
      .book-info-right
        .book-name-about(class="pad")
          .name {{book.bookName}}
          .about
            span.sty 作者:{{book.author}}
            span.sty 出版社:{{book.publisher}}
            span 出版时间:{{book.publishDate | formatDate2}}
        .book-lock-mobile(class="pad")
          .left
            .price 价格：{{book.bookPrice}}源币
            .btn
              el-button(
                size="small",
                type="success"
              ) 免费试读
              el-button(
                size="small",
                type="danger"
              ) 购买
          .right
            el-image.mobile(fit="fill", src="http://www.ireader.com/index.php?ca=bookdetail.AppOpenQr&bid=10889522")
        .book-thanks(class="pad")
          .user-upload(v-if="contributor.userId !== 1")
            img.medal(src="../assets/svg/medal.svg")
            el-avatar(:size="50", :src="userImgSrc")
            .thanks-name {{contributor.userName}}
            .thanks-content 👆本资源由上述用户上传，感谢对本站的大力支持
          .admin-upload(v-else)
            p(style="font-size: 14px; color: #777;") 由书源网整理发布，如果侵犯了您的版权请联系我们
    .review-recommend
      .review-list
        .show-star
          .star-text 综合评价
          el-rate.star(
            v-model="value",
            disabled,
            show-score,
            text-color="#ff9900",
            score-template="{value}",
          )
          el-button(
            size="mini",
            type="primary"
          ) 我也说两句
      .recommend-list
</template>

<script>
  export default {
    props: {
      bookId: String
    },
    // computed: {
    //   userImgSrc() {
    //     return this.$photoHeader + this.contributor.image 
    //   },
    //   bookImgSrc() {
    //     return this.$photoHeader + this.book.image 
    //   }
    // },
    data() {
      return {
        src: 'http://book.img.ireader.com/idc_1/m_1,w_156,h_208,q_100/e1c9fe3c/group6/M00/6C/9B/CmQUNlauC5uETavmAAAAANzPruo172792771.jpg?v=Qr4Ki2iQ',
        book: {},
        contributor: {},
        userImgSrc: '',
        bookImgSrc: '',
        value: 3.7
      }
    },
    methods: {
      getBookInfo() {
        this.$http.get(`/book/querybookinfo?bookId=${this.bookId}`).then(
          res => {
            if(res) {
              this.book = res.data.obj
              this.contributor = res.data.obj.user
              this.userImgSrc = this.$photoHeader + this.contributor.image
              this.bookImgSrc = this.$photoHeader + this.book.image
            }
          }
        )
      }
    },
    created () {
      this.getBookInfo()
    },
  }
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
      background: url('../assets/image/sjIcon.png') no-repeat;
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
        top: -16px;
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
      height: 20px;
      padding: 30px 40px;
      .show-star {
        display: flex;
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
      padding: 40px;
    }
  }
}
</style>