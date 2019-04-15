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