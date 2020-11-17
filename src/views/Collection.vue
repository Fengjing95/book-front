<!--
 * @Date: 2020-11-10 21:28:01
 * @LastEditors: 小枫
 * @description: 我的书架
 * @LastEditTime: 2020-11-17 09:31:19
 * @FilePath: \book\src\views\Collection.vue
-->
<template lang="pug">
.collection
  .have-collection(v-if="collectionList")
    .stage(v-for="index of row", :key="index")
      ul.books-list()
        li(
          v-for="item in collectionList.slice((index - 1) * 6, (index - 1) * 6 + 6)",
          :key="item.bookId"
        )
          el-tooltip(placement="right", :open-delay="300")
            div(slot="content") 《{{item.bookName}}》<br/>作者：{{item.author}}<br/>出版社：{{item.publisher}}
            img(:src="$photoHeader+item.image", @click="$router.push(`/book/${item.bookId}`)")
      .desk
      .desk-shadow
  .no-collection(v-else)
    .img
    .text
      h2 还没有收藏呢
      div 快去添加第一本收藏吧
</template>

<script>
export default {
  data() {
    return {
      collectionList: []
    }
  },
  computed: {
    row() {
      return Math.ceil(this.collectionList.length / 6)
    }
  },
  methods: {
    getCollection() {
      this.$http.get("/book/mycollection").then((res) => {
        if (res) {
          // console.log(res);
          this.collectionList = res.data.obj
        }
      });
    },
  },
  created() {
    this.getCollection();
  },
};
</script>

<style lang="less" scoped>
.collection {
  width: 1000px;
  padding: 30px 60px;
  margin: 0 auto;
  text-align: left;
  min-height: calc(100vh - 122px);
  background-color: #fff;
  ul {
    list-style: none;
  }
  .stage {
    position: relative;
    // margin:100px;
  }
  .desk {
    background: #eae1dc;
    width: 1000px;
    height: 20px;
    position: relative;
    bottom: 0px;
    border-bottom: 1px solid #f5ebe9;
    z-index: 1;
    transform-style: preserve-3d;
  }

  .desk:after {
    content: "";
    background: #f2edea;
    width: 1148px;
    position: absolute;
    height: 65px;
    transform: perspective(300px) rotateX(50deg) translateX(-84px)
      translateY(-90px);
  }
  .desk-shadow {
    position: relative;
    bottom: 0px;
    z-index: 0;
    background: none;
    width: 1020px;
    height: 65px;
    box-shadow: 0 56px 63px rgba(0, 0, 0, 0.3);
    transform: perspective(300px) rotateX(33deg) translateX(3px)
      translateY(-90px);
  }
  .books-list li {
    position: relative;
    display: inline-block;
    margin-left: 24px;
    width: 130px;
    height: 134px;
    z-index: 4;
    overflow-y: hidden;
    overflow-x: visible;
    
    &:after {
      content: "";
      position: absolute;
      overflow: hidden;
      right: 28px;
      bottom: 0px;
      width: 25px;
      height: 129px;
      background: rgba(0, 0, 0, 0.4);
      box-shadow: 0 0 5px rgba(0, 0, 0, 0.4);
      transform: perspective(300px) rotateX(29deg) rotateY(-61deg)
        rotateZ(-11deg) translateX(8px) translateY(8px);
      z-index: -1;
    }
    img {
      width: 99px;
      height: 134px;
      cursor: pointer;
      border: solid 1px #f0f0f0;
      // border-right: solid 3px #f1f0e0;
    }
  }
  .img {
    background: url('../assets/svg/no-collection.svg') no-repeat 100% 100%;
    width: 386.4px;
    height: 406.4px;
    position: relative;
    right: -500px;
    top: 110px;
  }
  .text {
    position: relative;
    top: -200px;
    right: -100px;
    h2 {
      color: #409eff;
    }
  }
}
</style>