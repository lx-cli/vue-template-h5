const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin
const TerserPlugin = require('terser-webpack-plugin')

const isProjuction = process.env.NODE_ENV === 'production'
const path = require('path')

module.exports = {
  publicPath: isProjuction ? '/maskgame' : '/',
  outputDir: 'dist',
  assetsDir: "static", //放置静态资源的目录
  devServer: {
    // open: true, //浏览器自动打开页面
    disableHostCheck: true, //关闭host检查（主要解决把本地地址映射到外网，出现Invalid Host header错误）
    // 设置代理，配置特定的请求代理到对应的API接口
    proxy: {
      '/api': {
        target: 'http://test.zmdtech.com.cn/', // 域名
        changOrigin: true, //开启代理：在本地会创建一个虚拟服务端，然后发送请求的数据，并同时接收请求的数据，这样服务端和服务端进行数据的交互就不会有跨域问题
        ws: true,
        pathRewrite: {
          '^/api': ''
        }
      }
    }
  },
  configureWebpack: config => {
    if (isProjuction) {
      //为生产环境修改配置
      config.plugins.push(
        //自动删除console
        new TerserPlugin({
          terserOptions: {
            compress: {
              warnings: false,
              drop_console: true,
              drop_debugger: true,
              pure_funcs: ['console.log']
            }
          }
        }),
        new BundleAnalyzerPlugin()
      )
    }
  },
  //配置CSS预处理器less文件自动化导入(用于颜色、变量、mixin……)
  chainWebpack: config => {
    const types = ['vue-modules', 'vue', 'normal-modules', 'normal']
    types.forEach(type => addStyleResource(config.module.rule('less').oneOf(type)))
  },
  // use thread-loader for babel & TS in production build
  // enabled by default if the machine has more than 1 cores
  parallel: require('os').cpus().length > 1,
  productionSourceMap: false,
  runtimeCompiler: true
}

function addStyleResource(rule) {
  rule.use('style-resource')
    .loader('style-resources-loader')
    .options({
      patterns: [
        //全局导入公共样式
        path.resolve(__dirname, './src/styles/mixin.less'),
        path.resolve(__dirname, './src/styles/variable.less')
      ]
    })
}