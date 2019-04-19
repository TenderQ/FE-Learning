# Webpack

## loader的作用

1. 实现对不同格式的文件的处理，比如说将`scss`转换为`css`，或者`typescript`转化为`js`
2. 转换这些文件，从而使其能够被添加到依赖图中

## loader和plugin的区别

- `loader` 用于加载某些资源文件。因为 `webpack` 本身只能打包`commonjs`规范的js文件，对于其他资源例如css，图片，或者其他的语法集，比如 `jsx`， `coffee`是没有办法加载的。 这就需要对应的`loader`将资源转化，加载进来

- `plugin` 用于扩展`webpack`的功能。它直接作用于 `webpack`，扩展了它的功能。当然`loader`也时变相的扩展了 `webpack` ，但是它只专注于转化文件（transform）这一个领域。而`plugin`的功能更加的丰富，而不仅局限于资源的加载, 从打包优化和压缩，到重新定义环境变量

- `loader`只能在打包之前运行，但是`plugins`在整个编译周期都起作用