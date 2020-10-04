/*
 * @Date: 2020-09-24 16:49:05
 * @LastEditors: 小枫
 * @LastEditTime: 2020-10-03 21:06:49
 * @FilePath: \book\src\plugins\element.js
 */
import Vue from 'vue'
import Element from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'


Element.Dialog.props.closeOnClickModal.default = false

Vue.use(Element)
