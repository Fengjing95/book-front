<!--
 * @Date: 2020-10-15 18:42:21
 * @LastEditors: 小枫
 * @description: 动态详情
 * @LastEditTime: 2020-10-15 18:46:52
 * @FilePath: \book\src\views\Dynamic.vue
-->
<template lang="pug">
  .article
    p {{dynamicId}}
</template>

<script>
  export default {
    props: {
      dynamicId: String
    },
    data() {
      return {
        key: 'value'
      }
    },
  }
</script>

<style lang="less" scoped>

</style>