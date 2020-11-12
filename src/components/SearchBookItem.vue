<!--
 * @Date: 2020-11-12 17:01:33
 * @LastEditors: 小枫
 * @description: 搜索界面书籍item
 * @LastEditTime: 2020-11-12 19:02:42
 * @FilePath: \book\src\components\SearchBookItem.vue
-->
<template lang="pug">
  .book-item
    el-image.img(:src="$photoHeader+bookObj.image", @click="linkTo")
    .info
      h4(@click="linkTo") {{bookObj.bookName}}
      .author(class="normal") {{bookObj.author}}
      .publisher(class="normal") {{bookObj.publisher}}
    .new(v-if="new Date().getTime() - bookObj.uploadDate <= 1000 * 60 * 60 * 24 * 7")
</template>

<script>
  export default {
    props: {
      bookObj: Object
    },
    methods: {
      linkTo() {
        this.$router.push(`/book/${this.bookObj.bookId}`)
      },
    },
  }
</script>

<style lang="less" scoped>
.book-item {
  text-align: left;
  width: 430px;
  height: 150px;
  background-color: #fff;
  border-radius: 8px;
  border: solid 1px #f0f0f0;
  box-sizing: border-box;
  position: relative;
  display: flex;
  .img {
    width: 97.5px;
    height: 130px;
    position: relative;
    top: 10px;
    right: -10px;
    cursor: pointer;
  }
  .info {
    position: relative;
    right: -20px;
    h4 {
      width: 280px;
      overflow: hidden;
      text-overflow:ellipsis;
      white-space: nowrap;
      cursor: pointer;
    }
    .normal {
      font-size: 13px;
      color: #777;
      margin-bottom: 10px;
      width: 300px;
      overflow: hidden;
      text-overflow:ellipsis;
      white-space: nowrap;
    }
  }
  .new {
      background: url('../assets/svg/new.svg') no-repeat 100% 100%;
      width: 48px;
      height: 48px;
      position: absolute;
      top: 0;
      right: 0;
    }
}
</style>