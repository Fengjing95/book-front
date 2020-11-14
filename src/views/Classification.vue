<!--
 * @Date: 2020-11-12 13:34:10
 * @LastEditors: 小枫
 * @description: 分类&搜索页面
 * @LastEditTime: 2020-11-13 18:37:54
 * @FilePath: \book\src\views\Classification.vue
-->
<template lang="pug">
  .classification
    .top-search
      h3 搜索中心
      el-input.input(v-model="searchInput", placeholder="请输入关键字", @keyup.enter.native="searchHandle")
      el-button(type="primary", @click="searchHandle") 搜索
    .center-class
      ul
        li(
          v-for="item in typeOptions",
          :key="item.typeId",
          @click="addClass(item.typeId)",
          :class="{active: item.typeId === current}"
        ) {{item.typeName}}
    .bottom-result(v-if="bookList.length !== 0")
      search-book-item.sty(
        v-for="item in bookList",
        :key="item.bookId",
        :bookObj="item"
      )
    .no-result(v-else)
      h4 没有找到你需要的书籍
      .bgi
    el-pagination(
      background,
      hide-on-single-page
      layout="prev, pager, next",
      :page-count="allPageNumber",
      :reviewPageNum="pageNumber",
      @current-change="currentPageChange",
    )
</template>

<script>
import SearchBookItem from '../components/SearchBookItem'
  export default {
    components: {
      SearchBookItem
    },
    props: {
      search: {
        type: String,
        default: ''
      },
      type: {
        type: String,
        default: '0'
      }
    },
    // watch: {
    //   current() {
    //     this.getBookList()
    //   },
    //   search() {
    //     this.getBookList()
    //   }
    // },
    created () {
      this.searchInput = this.search
      this.current = parseInt(this.type)
      this.getTypeList()
      this.getBookList()
    },
    data() {
      return {
        searchInput: undefined,
        typeOptions: [{typeId: 0, typeName: '查看全部'}],
        bookList: [],
        current: 0,
        pageNumber: 1,
        allPageNumber: undefined,
        
      }
    },
    methods: {
      currentPageChange(val) {
        this.pageNumber = val
        this.getBookList()
      },
      getTypeList() {
        this.$http.get('/booktype/querytype').then(
          res => {
            if(res) {
              this.typeOptions.push(...res.data.obj)
            }
          }
        )
      },
      async addClass(index) {
        this.current = index
        if(index !== 0) {
          await this.$router.push({path: '/classification', query: {search: this.searchInput, type: index}})
          this.getBookList()
        } else {
          await this.$router.push({path: '/classification', query: {search: this.searchInput}})
          this.getBookList()
        }
      },
      searchHandle() {
        this.$router.push({path: '/classification', query: {search: this.searchInput, type: this.current}})
        this.getBookList()
      },
      getBookList() {
        this.$http.get(`/book/fuzzy?key=${this.searchInput}&type=${this.type}&pageNumber=${this.pageNumber}&pageSize=20`).then(
          res => {
            if(res) {
              // console.log(res);
              this.allPageNumber = res.data.obj.totalPages
              this.bookList = res.data.obj.content
            }
          }
        )
      }
    },
  }
</script>

<style lang="less" scoped>
.classification {
  width: 1000px;
  margin: 0 auto;
  min-height: calc(100vh - 61px);
  background-color: #fff;
  .top-search {
    padding: 40px 0 30px 0;
    h3 {
      display: inline-block;
      margin-right: 20px;
    }
    .input {
      width: 300px;
      margin-right: 20px;
    }
  }
  .center-class {
    width: 900px;
    margin: 0 auto;
    text-align: left;
    padding-bottom: 20px;
    border-bottom: solid 1px #bfbfbf;
    .active {
      background-color: #409eff;
      border-radius: 5px;
      color: #fff;
      &:hover {
          color: #fff;
        }
    }
    ul {
      li {
        list-style: none;
        display: inline-block;
        padding: 5px 10px;
        font-size: 13px;
        cursor: pointer;
        &:hover {
          color: #409eff;
        }
      }
    }
  }
  .bottom-result {
    padding: 30px 50px;
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    .sty {
      margin-bottom: 20px;
    }
  }
  .no-result {
    display: flex;
    position: relative;
    h4 {
      color: #777;
      flex: 1;
      margin-top: 100px;
      position: relative;
      right: 50px;
    }
    .bgi {
      background: url('../assets/svg/no-search.svg') no-repeat 100% 100%;
      width: 200px;
      height: 200px;
      position: relative;
      right: 250px;
      top: 30px;
    }
  }
}
</style>