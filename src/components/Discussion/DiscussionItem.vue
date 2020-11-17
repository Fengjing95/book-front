<!--
 * @Date: 2020-10-13 18:17:54
 * @LastEditors: 小枫
 * @description: 123
 * @LastEditTime: 2020-11-17 09:25:58
 * @FilePath: \book\src\components\Discussion\DiscussionItem.vue
-->
<template lang="pug">
  //- 点击跳转路由至书圈详情
  .discussion-item(@click="goTo(`/discussion/${discussionObj.bdId}`)")
    el-image(
      :src="$photoHeader+discussionObj.bdPhoto",
      fit="fill"
      style="width: 42.5px; height: 60px;border: solid 1px #f0f0f0;"
    )
    .dis-about
      .name {{discussionObj.bdName}}
      el-tooltip(:content="discussionObj.bdDes",:open-delay=600 )
        .dis-des {{discussionObj.bdDes}}
</template>

<script>
  export default {
    props: {
      discussionObj: Object
    },
    methods: {
      goTo(link) {
        this.$router.push(link)
      }
    },
  }
</script>

<style lang="less" scoped>
.discussion-item {
  background-color: #fff;
  width: 300px;
  height: 100px;
  // display: inline-block;
  border: solid 1px rgb(212, 212, 212);
  margin: 15px calc(100px / 6);
  border-radius: 20px;
  box-shadow: 2px 4px 8px rgb(177, 177, 177);
  box-sizing: border-box;
  padding: 20px;
  transition: 0.3s;
  &:hover {
    transform: translateY(4px);
    box-shadow: none;
    transition: 0.3s;
    cursor: pointer;
  }
  .dis-about {
    margin-left: 10px;
    display: inline-block;
    .name {
      display: inline-block;
      line-height: 35px;
    }
    .dis-des {
      font-size: 13px;
    }
    div {
      width: 181px;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
    }
  }
}
</style>
