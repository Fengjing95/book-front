/*
 * @Date: 2020-09-26 10:26:26
 * @LastEditors: 小枫
 * @LastEditTime: 2020-10-30 10:40:38
 * @FilePath: \book\vue.config.js
 */
module.exports = {
  "devServer": {
    // https: false, // 是否https
    open: true, //配置自动启动浏览器
    port: 8000, // 端口号
    disableHostCheck: true, // 允许转发
    "proxy": {
      "/api": {
        "target": "http://192.168.1.162:8080/api", //代理地址
        // "target": "http://192.168.43.168:8080/api", //代理地址
        "ws": false,
        "changeOrigin": true,
        "pathRewrite": {
          "^/api": ""
        }
      }
    }
  },
  chainWebpack: (config) => {
    config
      .plugin('html')
      .tap((args) => {
        args[0].title = '书源';
        return args;
      });
  },
  assetsDir: 'static',
  parallel: false,
  publicPath: './',
}