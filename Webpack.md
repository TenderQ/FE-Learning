# Webpack

## webpack核心概念

- `entry` 指示 `webpack` 应该使用哪个模块，来作为构建其内部依赖图的开始

- `output` 属性告诉 `webpack` 在哪里输出它所创建的 `bundles`，以及如何命名这些文件

- `loader` 可以将所有类型的文件转换为 `webpack` 能够处理的有效模块，然后就可以利用 `webpack` 的打包能力，对它们进行处理

  - `test` 属性，用于标识出应该被对应的 `loader` 进行转换的某个或某些文件
  - `use` 属性，表示进行转换时，应该使用哪个 `loader`

- `plugins`: 可以参与打包的整个过程。从打包优化和压缩，到配置编译时的变量。插件接口功能极其强大，可以用来处理各种各样的任务

下面是一个完整的webpack配置文件

``` js
const HtmlWebpackPlugin = require('html-webpack-plugin'); // 通过 npm 安装
const webpack = require('webpack'); // 用于访问内置插件

module.exports = {
  entry: {
    app: './src/app.js',
    vendors: './src/vendors.js'
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].min.[hash:5].js'
  },
  module: {
    rules: [
      { test: /\.css$/, use: 'css-loader' }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({template: './src/index.html'})
  ]
}
```

## loader的作用

1. 实现对不同格式的文件的处理，比如说将`scss`转换为`css`，或者`typescript`转化为`js`
2. 转换这些文件，从而使其能够被添加到依赖图中

## loader和plugin的区别

- `loader` 用于加载某些资源文件。因为 `webpack` 本身只能打包`commonjs`规范的js文件，对于其他资源例如css，图片，或者其他的语法集，比如 `jsx`， `coffee`是没有办法加载的。 这就需要对应的`loader`将资源转化，加载进来

- `plugin` 用于扩展`webpack`的功能。它直接作用于 `webpack`，扩展了它的功能。当然`loader`也时变相的扩展了 `webpack` ，但是它只专注于转化文件（transform）这一个领域。而`plugin`的功能更加的丰富，而不仅局限于资源的加载, 从打包优化和压缩，到重新定义环境变量

- `loader`只能在打包之前运行，但是`plugins`在整个编译周期都起作用

## webpack常用loader

1. 编译相关

   `babel-loader`、`ts-loader`

2. 样式相关

   `style-loader`、`css-loader`、`less-loader`、`postcss-loader`

3. 文件相关

   `file-loader`、`url-loader`

## webpack常用plugin

1. 优化相关

   - `CommonsChunkPlugin`: 用来提取公共代码，通过将公共模块提取出来，只在页面加载的时候引入一次，提升应用的加载效率，`chunk`其实就是代码块的意思，可能是一个或多个模块，一般就是一个js文件

   - `UglifyjsWebpackPlugin`: 用来对js文件进行压缩和混淆

2. 功能相关

   - `ExtractTextWebpackPlugin`：抽取js引入的css文件进行单独打包，防止将样式打包在js中引起页面样式加载错乱的现象

   - `HtmlWebpackPlugin`：可以生成创建html入口文件，比如单页面可以生成一个html文件入口；为html文件中引入的外部资源如script、link动态添加每次compile后的hash，防止引用缓存的外部文件问题

   - `HotModuleReplacementPlugin`：热模块更新的插件

   - `CopyWebpackPlugin`：用于将单个文件或整个目录复制到打包构建目录

## webpack打包优化的解决方案

1. DLL方式

    DLL方式就是通过配置，告诉webpack指定库在项目中的位置，从而直接引入，不将其打包在内
    webpack通过`webpack.DllPlugin`与`webpack.DllReferencePlugin`两个内嵌插件实现此功能

    ``` js
    plugins: [
        new webpack.DllPlugin({
            path: './build/bundle.manifest.json',
            name: '[name]_library',
        })
    ]
    ```

2. `Happpypack` 用来加速代码构建

    Happypack 在编译过程中，除了利用多进程的模式加速编译，还同时开启了 cache 计算，能充分利用缓存读取构建文件，对构建的速度提升也是非常明显的

    ``` js
    plugins: [
        new HappyPack({
            id: 'happybabel',
            loaders: ['babel-loader'],
            threadPool: happyThreadPool,
            cache: true,
            verbose: true
        })
    ]
    ```

3. 增强代码代码压缩工具

    Webpack 默认提供的 `UglifyJS` 插件，由于采用单线程压缩，速度颇慢；推荐采用 `webpack-parallel-uglify-plugin` 插件，可以并行运行 UglifyJS 插件，更加充分而合理的使用 CPU 资源，大大减少的构建时间

    ``` js
    var ParallelUglifyPlugin = require('webpack-parallel-uglify-plugin');
    new ParallelUglifyPlugin({
        cacheDir: '.cache/',
        uglifyJS:{
            output: {
                comments: false
            },
            compress: {
                warnings: false
            }
        }
    })
    ```