# Webpack

## gulp和webpack区别

- `gulp`是一种工具，我们可以用它来优化前端的工作流程，比如自动刷新页面、合并、压缩css、js、编译`less`等等。具体体现为：在gulp的配置文件中书写一个个的`task`; `webpack`则是一种打包工具，或者说是一种模块化解决方案，实际上很大一部分人刚开始使用`webpack`的方式就是通过`gulp-webpack`这个插件，写好task来使用webpack对前端的一些文件进行打包;

- `gulp`的处理任务需要自己去写，`webpack`则有现成的解决方案，只需要在`webpack.config.js`配置好即可;

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

## Babel 中Preset和Plugin

`Babel`编译过程分为三个阶段：解析、转换和打印输出。

`Plugin`: 插件用于转换将ES6代码转成ES5，插件一般尽可能拆成小的力度，开发者可以按需引进。

`Preset`: 可以作为 `Babel` 插件的组合，比如`@babel/preset-env`, `@babel/preset-react`, `@babel/preset-typescript`

### Plugin与Preset执行顺序

可以同时使用多个Plugin和Preset，此时，它们的执行顺序非常重要

- 先执行完所有`Plugin`，再执行`Preset`。
- 多个`Plugin`，按照声明次序顺序执行（从前往后）。
- 多个`Preset`，按照声明次序逆序执行（从后往前）。

比如.babelrc配置如下：

``` json
{
  "plugins": [
    "transform-react-jsx",
    "transform-async-to-generator"
  ],
  "presets": [
    "es2015",
    "es2016"
  ]
}
```

那么执行的顺序为：

1. Plugin：transform-react-jsx、transform-async-to-generator
2. Preset：es2016、es2015

## Webpack HotModuleReplacementPlugin的运行机制

`webapck`在编译的过程中，将`HMR Runtime`嵌入到`bundle`中；编译结束后，`webpack`对项目代码文件进行监视，发现文件变动重新编译变动的模块，同时通知`HMR Runtime`，然后`HMR Runtime`加载变动的模块文件，尝试执行热更新操作。更新的逻辑是：先检查模块是否能支持`accept`方法，不支持的话，则冒泡查找模块树的父节点，直到入口模块，`accept`方法也就是模块`hot-replace`的`handler`

`HMR Runtime`是`webapck`内嵌到前端页面的代码，主要提供来能给个职能check和apply。check用来下载最新模块代码，runtime能够接收后端发送的事件和发送请求；apply用于更新模块，主要将要更新的模块打上tag，然后调用模块的（也有可能是父模块）的更新handler执行更新。

### 更新流程

热更新开启后，当webpack打包时，会向client端注入一段HMR runtime代码，同时server端（webpack-dev-server或是webpack-hot-middware）启动了一个HMR服务器，它通过websocket和注入的runtime进行通信。

当webpack检测到文件修改后，会重新构建，并通过ws向client端发送更新消息，浏览器通过jsonp拉取更新过的模块，回调触发模块热更新逻辑。

1. 修改了一个或多个文件。
2. 文件系统接收更改并通知`Webpack`。
3. `Webpack`重新编译构建一个或多个模块，并通知HMR服务器进行了更新。
4. `HMR Server`使用`websockets`通知HMR Runtime需要更新。HMR运行时通过HTTP请求这些更新（jsonp）。
5. `HMR`运行时替换更新中的模块，如果确定这些模块无法更新，则触发整个页面刷新
