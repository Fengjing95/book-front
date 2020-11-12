<!--
 * @Date: 2020-09-24 09:58:02
 * @LastEditors: 小枫
 * @LastEditTime: 2020-11-12 13:46:05
 * @FilePath: \book\src\views\Home.vue
-->
<template lang="pug">
  .home
    el-carousel.carousel(
      :interval='4000',
      type='card',
      height='250px',
      trigger="click"
    )
      el-carousel-item(v-for='item in carouselList' :key='item.showId')
        el-image(:src="$photoHeader+item.showImage", @click="$router.push(item.showRequest)")
</template>

<script>

export default {
  name: 'Home',
  data() {
    return {
      carouselList: [],

    }
  },
  methods: {
    getCarouselList() {
      this.$http.get('/show/showinfo').then(
        res => {
          if(res) {
            console.log(res);
            this.carouselList = res.data.obj
          }
        }
      )
    }
  },
  created () {
    this.getCarouselList()
  },
}
</script>

<style lang="less" scoped>
  .home {
    width: 1200px;
    margin: 0 auto;
    .carousel {
      margin: 20px 0;
    }
  }
</style>
