# HTML

## 静态定位，相对定位，绝对定位和固定定位

- 静态定位(`static`)是元素的默认定位方式，不能使用top，bottom，left，right和z-index属性。块级元素生成一个矩形框，作为文档流的一部分，行内元素则会创建一个或多个行框，置于其父元素中。
- 相对定位(`relative`)通过left、right、top、bottom属性确定元素在正常文档流中的偏移位置
- 绝对定位(`absolute`)将元素从文档流中拖出来, 将不占用原来元素的空间，然后使用left、right、top、bottom属性相对于其最接近的一个具有定位属性的父级元素进行绝对定位。如果不存在就逐级向上排查，直到相对于body元素，即相对于浏览器窗口。
- 固定定位(`fixed`)以浏览器窗口作为参考进行定位，它是浮动在页面中，元素位置不会随浏览器窗口的滚动条滚动而变化，不会受文档流动影响

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

    - 只有静态流的元素才会发生外边距折叠，发生折叠的原因是因为margin之间直接接触，没有阻隔
    - 外边距叠加存在两种情况：一是父子外边距叠加；二是兄弟外边距叠加
    - 解决办法： (1).设置`float`、`position`、`display: inline-block`, (2).创建两个BFC元素，将要设置margin的元素放在里面

2. `BFC` 可以包含浮动的元素（清除浮动）
3. `BFC` 可以阻止元素被浮动元素覆盖

参考文章：

[浅析BFC原理及作用](https://blog.csdn.net/DFF1993/article/details/80394150)

## CSS引入方式link与@import的区别

1. link是`XHTML`标签，除了加载CSS外，还可以定义RSS等其他事务；@import属于`CSS`范畴，只能加载CSS。

2. link引用CSS时，**在页面载入时同时加载**；@import**需要页面网页完全载入以后加载**，所以一般我们不推荐使用@import方法。

3. link是XHTML标签，无兼容问题；@import是在CSS2.1提出的，低版本的浏览器不支持，从这点来说，我们同样不推荐使用@import方法。

4. link支持使用`Javascript`控制DOM去改变样式；而@import不支持

## inline-block 元素之间的空白问题

空白间隔是由`inline-block`标签之间换行产生的

- 去掉标签中的空格和回车（不推荐）
- **设置父元素font-size:0;子元素重新设置自己的font-size**
- 使用`float`浮动

## Rem布局原理

`rem`布局的本质是等比缩放，一般是基于宽度

``` CSS
html {font-size: 16px}

/* 作用于非根元素，相对于根元素字体大小，所以为32px */
p {font-size: 2rem}
```

    结合vw使用

    ``` css
    html {fons-size: 1vw} /* 1vw = width / 100 */
    p {width: 16rem}
    ```

[使用CSS3 REM 和 VW 打造等比例响应式页面的便捷工作流](https://zhuanlan.zhihu.com/p/23968868)

## 移动端1像素边框问题

使用`transform: scale(0.5)` 方案

``` css
.border-bottom::after {
    content:'';
    width:100%;
    border-bottom:1px solid #000;
    transform: scaleY(0.5);
}
/* 2倍屏 */
@media only screen and (-webkit-min-device-pixel-ratio: 2.0) {
    .border-bottom::after {
        transform: scaleY(0.5);
    }
}
/* 3倍屏 */
@media only screen and (-webkit-min-device-pixel-ratio: 3.0) {
    .border-bottom::after {
        transform: scaleY(0.33);
    }
}
```

[参考文章](https://segmentfault.com/a/1190000007604842#articleHeader7)
