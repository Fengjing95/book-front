<!--
 * @Date: 2020-10-16 19:41:57
 * @LastEditors: 小枫
 * @description: 123
 * @LastEditTime: 2020-10-19 09:13:49
 * @FilePath: \book\src\views\Editor.vue
-->
<template lang="pug">
.editor
  mavon-editor(
    v-model="oldContent",
    @save="saveContent",
    @change="changeData",
    @imgAdd="$imgAdd",
    style="min-height: 600px;",
    ref="mavon",
    :ishljs = "true"
  )
  .tips 
    .text 按F10全屏,F12切换单双屏,Ctrl+S发布(请不要随意修改url)
    el-button.btn(type="primary", @click="saveContent") 发布
</template>

<script>
export default {
  props: {
    bdId: String
  },
  // 本地图片上传需要配置cdn
  data() {
    return {
      oldContent: '',
      dynamic: {
        content: '',
      },
    };
  },
  methods: {
    changeData(value, render) {
      // console.log(value);
      // console.log(render);
      this.dynamic.content = render
    },
    // 发布
    saveContent() {
      this.$confirm('发布之后将不可修改, 是否需要再修改一下?', '提示', {
          confirmButtonText: '改好了',
          cancelButtonText: '再改改',
          type: 'info'
      }).then(() => {
        const dynamicObj = {...this.dynamic}
        dynamicObj.abstracts = this.dynamic.content
        dynamicObj.abstracts = dynamicObj.abstracts.replace(/<\/?.+?\/?>/g, '') // 去除标签
        dynamicObj.bdId = this.bdId
        this.$http.post("/dynamic/releasedynamic", dynamicObj).then((res) => {
          if (res) {
            this.$message({
              type: "success",
              message: "发布成功",
            });
            this.$router.push(`/discussion/${this.bdId}`);
          }
        })
      }).catch((error) => {
        // console.log(error);
        error
      })
    },
    // 上传图片
    $imgAdd(pos, $file) {
      const formData = new FormData()
      formData.append('image', $file)
      // console.log(formData.get('image'));
      this.$http.post('/upload/uploadimage/', formData
      ).then((url) => {
        // console.log(url);
        this.$refs.mavon.$img2Url(pos, this.$photoHeader+url.data.obj)
      })
    }
  },
  created() {
  },
};
</script>

<style lang="less" scoped>
.editor {
  margin: 0 auto;
  width: 1000px;
  .tips {
    margin-top: 30px;
    .text {
      float: left;
    }
    .btn {
      float: right;
    }
  }
}
</style>
