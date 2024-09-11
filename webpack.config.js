
const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const CopyWebpackPlugin = require('copy-webpack-plugin');
const { watch } = require("fs");
module.exports = {
  // 入口
  // 相对路径和绝对路径都行
  entry: "./src/main.js",
  // 输出
  output: {
    // path: 文件输出目录，必须是绝对路径
    // path.resolve()方法返回一个绝对路径
    // __dirname 当前文件的文件夹绝对路径
    path: path.resolve(__dirname, "dist"),
    // filename: 输出文件名
    filename: "static/js/main.js", // 将 js 文件输出到 static/js 目录中
    clean: true, // 自动将上次打包目录资源清空
    // webpack-dev-server 会默认从 publicPath 为基准，使用它来决定在哪个目录下启用服务，
    // 来访问 webpack 输出的文件；不写即为根目录
    publicPath: '' 
    
  },
  // 加载器
  module: {
    rules: [
        {
        // 用来匹配 .css 结尾的文件
        test: /\.css$/,
        // use 数组里面 Loader 执行顺序是从右到左
        use: ["style-loader", "css-loader"],
        },
    ],
  },
  // 插件
  plugins: [
    new HtmlWebpackPlugin({
        // 以 public/index.html 为模板创建文件
        // 新的html文件有两个特点：1. 内容和源文件一致 2. 自动引入打包生成的js等资源
        template: path.resolve(__dirname,'public/index.html')
    }),
    new CopyWebpackPlugin({ // 将需要复制的静态资源从现有文件夹名称 =》自定义文件夹名称中
        patterns: [
          { from: 'assets', to: 'demo/assets' },
          { from: 'other', to: 'temp/other' }
        ]
    })
  ],
  devServer: {
    // 用来告知开发服务器需要添加哪些静态资源
    // （启动后的服务中资源的层级关系请打开 https://localhost:3000/webpack-dev-server 即可清晰看到）
    static: [ 
        {
            directory: path.join(__dirname, 'assets'), // 获取资源的文件路径
            publicPath:'/demo/assets' // 告知服务器哪个路径需要提供上述文件服务（如果是顶层就空着）
        },
        {
            directory: path.join(__dirname, 'other'),
            publicPath:'/temp/other',
            watch: false // 这个静态资源是否需要监听更改，true时文件内容更改则实时刷新，默认开启
        },

    ],
    server: 'https', // 开发服务器通过https进行服务
    // 访问服务器地址 'local-ip' | 'local-ipv4' | 'local-ipv6'  如果想在同网段中他人也可访问，则配置local-ipv4
    host: "localhost", 
    port: "auto", // 启动服务器端口号 auto则会不指定端口，有被占用的自动打开其他端口
    open: true, // 是否自动打开浏览器
    client: {
        progress: true, // 以百分比显示编译进度
        logging: 'info', // 控制台上是否输出关于webpack-dev-server相关的一些日志
        overlay: true // 编译报错是全屏覆盖
      },
    // 单页面程序在操作h5的history路径，所有路径一律index.html兜底显示；
    // 当然多页面的话，也可以正则匹配路径，指定转到对应页面
    historyApiFallback: true, 
    hot: 'only', // 在构建失败时不刷新页面,即当前版本作为回退版本  only/true webpack5默认开启
    // liveReload: true 
  },
  // 模式
  mode: "development", // 开发模式
};