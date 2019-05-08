# Webpack

## loader的作用

1. 实现对不同格式的文件的处理，比如说将`scss`转换为`css`，或者`typescript`转化为`js`
2. 转换这些文件，从而使其能够被添加到依赖图中

## loader和plugin的区别

- `loader` 用于加载某些资源文件。因为 `webpack` 本身只能打包`commonjs`规范的js文件，对于其他资源例如css，图片，或者其他的语法集，比如 `jsx`， `coffee`是没有办法加载的。 这就需要对应的`loader`将资源转化，加载进来

- `plugin` 用于扩展`webpack`的功能。它直接作用于 `webpack`，扩展了它的功能。当然`loader`也时变相的扩展了 `webpack` ，但是它只专注于转化文件（transform）这一个领域。而`plugin`的功能更加的丰富，而不仅局限于资源的加载, 从打包优化和压缩，到重新定义环境变量

- `loader`只能在打包之前运行，但是`plugins`在整个编译周期都起作用

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