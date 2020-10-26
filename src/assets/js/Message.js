/*
 * @Date: 2020-10-25 18:53:54
 * @LastEditors: 小枫
 * @description: 消息对象
 * @LastEditTime: 2020-10-26 16:31:51
 * @FilePath: \book\src\assets\js\Message.js
 */
class Message {
  constructor() {
    this.msg = null
    this.targetId = null
    this.read = false
    this.dynamicId = null
    this.token = null
  }
}
module.exports = Message