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

## IFC

IFC(Inline Formatting Contexts)直译为"内联格式化上下文"，IFC的line box（线框）高度由其包含行内元素中最高的实际高度计算而来（不受到竖直方向的padding/margin影响)IFC中的line box一般左右都贴紧IFC，但是会因为`float`元素而扰乱。
`float`元素会位于IFC与与line box之间，使得line box宽度缩短。 IFC中是不可能有块级元素的，当插入块级元素时（如p中插入div）会产生两个匿名块与div分隔开，即产生两个IFC，每个IFC对外表现为块级元素，与div垂直排列。

### IFC作用

- 水平居中：当一个块要在环境中水平居中时，设置其为`inline-block`则会在外层产生IFC，通过`text-align:center`则可以使其水平居中。
- 垂直居中：创建一个IFC，用其中一个元素撑开父元素的高度，然后设置其`vertical-align:middle`，其他行内元素则可以在此父元素下垂直居中。

## FFC

FFC(Flex Formatting Contexts)直译为"自适应格式化上下文"，`display`值为`flex`或者`inline-flex`的元素将会生成自适应容器

`Flex Box` 由伸缩容器和伸缩项目组成。设置为`flex` 的容器被渲染为一个块级元素，而设置为 `inline-flex` 的容器则渲染为一个行内元素。

伸缩容器中的每一个子元素都是一个伸缩项目。伸缩项目可以是任意数量的。伸缩容器外和伸缩项目内的一切元素都不受影响。简单地说，Flexbox 定义了伸缩容器内伸缩项目该如何布局。

## CSS优先级规则

!important > 内联 > ID选择器 > 伪类=属性选择器=类选择器 > 元素选择器[p] > 通用选择器(*) > 继承的样式

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

## CSS实现水平垂直居中

``` html
<div class='box'>
    <div class='content'></div>
</div>
```

1. 父元素设置为`position: relative` 子元素设置为`position: absolute`, 利用`margin: auto`

    ``` css
    .box {
        position: relative;
        width: 300px;
        height: 300px;
    }
    .content {
        position: absolute;
        background-color: #F00;
        width: 100px;
        height: 100px;
        left: 0;
        top: 0;
        right: 0;
        bottom: 0;
        margin: auto
    }
    ```

2. 利用`transform: translate(-50%, -50%)`

    ``` css
    .box {
        position: relative;
        width: 300px;
        height: 300px;
    }
    .content {
        position: absolute;
        background-color: #F00;
        width: 100px;
        height: 100px;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
    }
    ```

3. `flex`布局

    ``` css
    .box {
        display: flex; //flex布局
        width: 300px;
        height: 300px;
        justify-content: center; // 使子项目水平居中
        align-items: center; // 使子项目垂直居中
    }
    .content {
        background-color: #F00;
        width: 100px;
        height: 100px;
    }
    ```

## 如何避免浏览器回流和重绘

减少回流、重绘其实就是需要减少对render tree的操作，并减少对一些style信息的请求，尽量利用好浏览器的优化策略

- 不要一个一个改变元素的样式属性，最好直接改变className，但className是预先定义好的样式，不是动态的，如果要动态改变一些样式，则使用cssText来改变

   ``` js
    var left = 10, top = 10;  
    el.style.left = left + 'px';  
    el.style.top  = top  + 'px';  

    // 比较好的写法
    el.className += ' className1';

    // 比较好的写法
    el.style.cssText += '; left: ' + left + 'px; top: ' + top + 'px;';
   ```

- 让要操作的元素进行'离线处理'，处理完后一起更新，这里所谓的"离线处理"即让元素不存在于`render tree`中, 比如使用`documentFragment`或`div`等元素进行缓存操作或者先`display:none`隐藏元素，然后对该元素进行所有的操作，最后再显示该元素

- 避免使用`table`布局，在布局完全建立之前，`table`需要很多关口，`table`是可以影响之前已经进入的DOM元素的显示的元素。即使一些小的变化和会导致`table`中所有其他节点回流

- 将需要多次回流的元素`position`属性设为`absolute`或`fixed`，这样该元素就会脱离文档流，它的变化不会影响其他元素变化。比如动画效果应用到`position`属性为`absolute`或`fixed`的元素上

- 避免使用`css`的`JavaScript`表达式，因为每次都需要重新计算文档，或部分文档、回流

- 使用`trsansform`来实现动画效果

- 不要经常访问会引起浏览器`flush`队列的属性，如果确实要访问，就先读取到变量后进行缓存，以后用的时候直接读取变量

    对于`flush`队列的属性浏览器不会马上操作它们，而是会先缓存在队列中，有一定时间顺序去执行这些操作，但是在这过程中我们需要去获取在该队列中的属性时，浏览器为取得正确的值就会触发重排。这样就使得浏览器的优化失效了

    `flush队列属性: offsetTop、offsetLeft、 offsetWidth、offsetHeight、scrollTop、scrollLeft、scrollWidth、scrollHeight、clientTop、clientLeft、clientWidth、clientHeight`

## CSS3渐变色

- 线性渐变 `background: linear-gradient(to right, red, blue);` 从左边开始起点是红色，慢慢过渡到蓝色

- 径向渐变 `background: radial-gradient(red 5%, green 15%, blue 60%)`

> 设置文字渐变色加入设置以下属性:

``` css
background-image: -webkit-linear-gradient(bottom,red, blue);
-webkit-text-fill-color: transparent;   //填充透明
-webkit-background-clip: text;      //针对于文本
```

## CSS3实现border渐变色

``` css
border-image: linear-gradient(#ddd, #000) 30 30
```

`border-image`无法实现圆角, 但是可以通过`padding`来实现，给父节点设置**渐变背景**，通过padding模拟边框（此处的padding值就是border需要的值），注意父元素和子元素的`border-radius`属性值保持一致

``` html
<style>
.content {
  width: 100px;
  height: 100px;
  box-sizing: border-box;
  padding: 5px;
  border-radius: 50%;
  background-image: linear-gradient(top, red 0%, blue 30%, yellow 60%, green 90%);
}
.box {
  width:100%;
  height:100%;
  border-radius:50%;
  background:#fff;
}
</style>

<div class="content">
  <div class="box"></div>
</div>
```

## CSS3 blur滤镜实现

``` html
.blur {
  filter: blur(10px);
}

<img src="1.jpg" class="blur" />
```

## CSS3中flex的用法

通过给容器设置`display: flex`可指定为Flex（弹性盒子）布局，容器设为Flex布局以后，它的所有子元素自动成为容器成员，称为Flex项目（flex item）。子元素的`float`、`clear`和`vertical-align`属性将失效

### 容器的属性

- `flex-direction`: 决定主轴的方向（即子项目的排列方向）

  - row（默认）：主轴为水平方向，起点在左端
  - row-reverse：主轴为水平方向，起点在右端
  - column：主轴为垂直方向，起点在上沿
  - column-reverse：主轴为垂直方向，起点在下沿

- `flex-wrap`: 该属性定义如果一条轴线排不下子元素，如何换行

  - nowrap（默认）：不换行
  - wrap：换行，第一行在上方
  - wrap-reverse：换行，第一行在下方

- `flex-flow`: 是`flex-direction`属性和`flex-wrap`属性的简写形式，默认值为`row nowrap`

- `justify-content`: 定义子项目在主轴上的对齐方式

  - flex-start（默认值）：左对齐
  - flex-end：右对齐
  - center： 居中
  - space-between：两端对齐，项目之间的间隔都相等。
  - space-around：每个项目两侧的间隔相等

- `align-items`: 定义子项目在交叉轴(垂直方向)上如何对齐

  - stretch（默认值）：如果项目未设置高度或设为auto，将占满整个容器的高度
  - flex-start：交叉轴的起点对齐
  - flex-end：交叉轴的终点对齐
  - center：交叉轴的中点对齐
  - baseline: 项目的第一行文字的基线对齐

- `align-content`: 定义多根轴线的对齐方式。如果子项目只有一根轴线，该属性不起作用，属性值同`align-items`

### 子项目的属性

- `order`: 定义子项目的排列顺序，数值越小，排列越靠前，默认为0

- `flex-grow`: 定义子项目的放大比例，默认为0，即如果存在剩余空间，也不放大

  如果所有项目的`flex-grow`属性都为1，则它们将等分剩余空间（如果有的话）。如果一个项目的`flex-grow`属性为2，其他项目都为1，则前者占据的剩余空间将比其他项多一倍

- `flex-shrink`: 定义子项目的缩小比例，默认为1，即如果空间不足，该项目将缩小

- `flex-basis`: 定义了在分配多余空间之前，项目占据的主轴空间（main size）。浏览器根据这个属性，计算主轴是否有多余空间。它的默认值为auto，即项目的本来大小

  它可以设为跟`width`或`height`属性一样的值，则项目将占据固定空间

- `flex`: 是`flex-grow`, `flex-shrink` 和 `flex-basis`的简写，默认值为`0 1 auto`, 后两个属性可选

- `align-self`: 属性允许单个项目有与其他项目不一样的对齐方式，可覆盖容器上`align-items`属性。默认值为`auto`，表示继承父元素的align-items属性，如果没有父元素，则等同于`stretch`。属性值与`align-items`属性一致