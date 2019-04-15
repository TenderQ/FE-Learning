# HTML

## BFC

`BFC` 即 `Block Formatting Contexts` (块级格式化上下文), **具有BFC特性的元素可以看做是隔离了的独立容器，容器里面的元素不会在布局上影响到外面的元素**

只要元素满足下面任一条件即可触发 BFC 特性：

- `body` 根元素
- 浮动元素：`float` 除 `none` 以外的值
- 绝对定位元素：`position (absolute、fixed)`
- `display` 为 `inline-block、table-cells、flex`
- `overflow` 除了 `visible` 以外的值 `(hidden、auto、scroll)`

BFC 的特性:

1. 同一个 `BFC` 下外边距会发生折叠
2. `BFC` 可以包含浮动的元素（清除浮动）
3. `BFC` 可以阻止元素被浮动元素覆盖

参考文章：

[浅析BFC原理及作用](https://blog.csdn.net/DFF1993/article/details/80394150)

## CSS引入方式link与@import的区别

1. link是`XHTML`标签，除了加载CSS外，还可以定义RSS等其他事务；@import属于`CSS`范畴，只能加载CSS。

2. link引用CSS时，**在页面载入时同时加载**；@import**需要页面网页完全载入以后加载**，所以一般我们不推荐使用@import方法。

3. link是XHTML标签，无兼容问题；@import是在CSS2.1提出的，低版本的浏览器不支持，从这点来说，我们同样不推荐使用@import方法。

4. link支持使用`Javascript`控制DOM去改变样式；而@import不支持