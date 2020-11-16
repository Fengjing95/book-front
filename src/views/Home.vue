<!--
 * @Date: 2020-09-24 09:58:02
 * @LastEditors: 小枫
 * @LastEditTime: 2020-11-15 10:11:13
 * @FilePath: \book\src\views\Home.vue
-->
<template lang="pug">
  .home
    .carousel-father
      .carousel
        el-carousel(
          :interval='4000',
          type='card',
          height='250px',
          trigger="click"
        )
          el-carousel-item(v-for='item in carouselList' :key='item.showId')
            el-image(:src="$photoHeader+item.showImage", @click="$router.push(item.showRequest)")
    .top
      book-top(style="margin-top: 30px", :recommendList="bookTopList", :bestSellList="bestSellList")
      user-top(style="margin-top: 30px", :userList="userTopList")
</template>

<script>
import UserTop from '../components/Top/UserTop'
import BookTop from '../components/Top/BookTop'
export default {
  name: 'Home',
  components: {
    UserTop,
    BookTop
  },
  data() {
    return {
      carouselList: [],
      userTopList: [],
      bookTopList: [],
      bestSellList: []
    }
  },
  methods: {
    getCarouselList() {
      this.$http.get('/show/showinfo').then(
        res => {
          if(res) {
            // console.log(res);
            this.carouselList = res.data.obj
          }
        }
      )
    },
    getUserTopList() {
      this.$http.get('/top/query').then(
        res => {
          if(res) {
            // console.log(res);
            this.userTopList = res.data.obj
          }
        }
      )
    },
    getBookTopList() {
      this.$http.get(`/book/typetop?typeId=1`).then(
        res => {
          if(res) {
            // console.log(res);
            this.bookTopList = res.data.obj
          }
        }
      )
    },
    getBestSellList() {
      this.$http.get('/book/top').then(
        res => {
          if(res) {
            this.bestSellList = res.data.obj
          }
        }
      )
    }
  },
  created () {
    this.getCarouselList()
    this.getUserTopList()
    this.getBookTopList()
    this.getBestSellList()
  },
}
</script>

<style lang="less" scoped>
  .home {
    margin: 0 auto;
    .carousel-father {
      width: 100%;
      background-color: #fff;
      .carousel {
        width: 1200px;
        margin: 0 auto;
      }
    }
    
  }
</style>
