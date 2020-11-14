<!--
 * @Date: 2020-11-14 15:42:28
 * @LastEditors: 小枫
 * @description: description
 * @LastEditTime: 2020-11-14 21:30:11
 * @FilePath: \book\src\components\Top\BookTop.vue
-->
<template lang="pug">
  .book-top
    .bt-icon
    .bt-left
      h2 强烈推荐
      .bt-l-left(v-for="item in first", :key="item.bookId")
        el-image.book-img(:src="$photoHeader+item.image", @click="linkToBook(item.bookId)")
        .book-name(@click="linkToBook(item.bookId)") {{item.bookName}}
        .book-author 作者：{{item.author}}
      .bt-l-right
        .bt-l-r-item(v-for="item in other" :key="item.bookId")
          el-image.book-img2(:src="$photoHeader+item.image", @click="linkToBook(item.bookId)")
          .book-name2(@click="linkToBook(item.bookId)", v-text="item.bookName")
          .book-author2(v-text="item.author")
    .bt-right
      .fire-icon
        h3 畅销榜
</template>

<script>
  export default {
    props: {
      recommendList: Array,
      bestSellList: Array
    },
    computed: {
      first() {
        return this.recommendList.slice(0, 1)
      },
      other() {
        return this.recommendList.slice(1)
      }
    },
    methods: {
      linkToBook(target) {
        this.$router.push(`/book/${target}`)
      }
    },
  }
</script>

<style lang="less" scoped>
.book-top {
  width: 1000px;
  margin: 0 auto;
  background-color: #fff;
  display: flex;
  position: relative;
  .bt-icon {
    background: url('../../assets/svg/recommend.svg') no-repeat;
    width: 64px;
    height: 64px;
    position: absolute;
    top: -6px;
    left: -6px;
  }
  .bt-left {
    display: flex;
    position: relative;
    padding-top: 74px;
    text-align: left;
    h2 {
      position: absolute;
      top: 0;
      left: 50%;
      transform: translateX(-50%);
    }
    .bt-l-left {
      width: 358px;
      height: 526px;
      position: relative;
      
      padding: 30px;
      box-sizing: border-box;
      .book-img {
        width: 156px;
        height: 208px;
        position: absolute;
        bottom: 50px;
        right: 50px;
        cursor: pointer;
      }
      .book-name {
        cursor: pointer;
        &:hover {
          color: #83c0ff;
        }
      }
      .book-author {
        font-size: 15px;
        color: #777;
        margin: 10px 0 0 20px;
      }
    }
    .bt-l-right {
      width: 356px;
      height: 526px;
      border-left: solid 1px #f0f0f0;
      display: flex;
      flex-wrap: wrap;
      .bt-l-r-item {
        font-size: 14px;
        width: 177.5px;
        .book-name2 {
          margin-left: 37.25px;
          overflow: hidden;
          text-overflow:ellipsis;
          white-space: nowrap;
          cursor: pointer;
          &:hover {
            color: #83c0ff;
          }
        }
        .book-img2 {
          margin: 20px 0 30px 37.25px;
          width: 104px;
          height: 138.7px;
          cursor: pointer;
        }
        .book-author2 {
          font-size: 13px;
          margin-left: 37.25px;
          color: #777;
        }
      }
      .bt-l-r-item:nth-of-type(1) {
        border-right: solid 1px #f0f0f0;
        border-bottom: solid 1px #f0f0f0;
      }
      .bt-l-r-item:nth-of-type(2) {
        border-bottom: solid 1px #f0f0f0;
      }
      .bt-l-r-item:nth-of-type(3) {
        border-right: solid 1px #f0f0f0;
      }
    }
  }
  .bt-right {
    border-left: solid 1px #f0f0f0;
    width: 283px;
    padding: 20px 10px;
    .fire-icon {
      background: url('../../assets/svg/fire.svg') no-repeat;
      width: 150px;
      height: 32px;
      h3 {
        margin: 0;
        line-height: 32px;
      }
    }
  }
}
</style>