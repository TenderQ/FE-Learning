# v-DOM

## v-DOM是什么？

- v-DOM即虚拟DOM
- 是用JS模拟DOM结构
- DOM变化的对比放在JS层来做(依赖于diff算法)
- 提高重绘性能(DOM操作开销是最昂贵的，JS运行效率高)

## v-DOM如何应用，核心API是什么？

[snabbdom](https://github.com/snabbdom/snabbdom)(vue2.0使用)

- `h`函数
- `patch`函数

``` javascript
var snabbdom = require('snabbdom');
var h = require('snabbdom/h').default;
var patch = snabbdom.init([
  require('snabbdom/modules/class').default,
  require('snabbdom/modules/props').default,
  require('snabbdom/modules/style').default,
  require('snabbdom/modules/eventlisteners').default,
]);

var container = document.getElementById('container');
var newVnode = h('div#container', {attrs: {} }, [
  h('h1', {}, 'Headline') // children
]);
patch(container, newVnode); // patch(oldVnode, newVnode)
```

## diff算法实现流程

- `patch(container, vnode)` 和 `patch(oldVnode, newVnode)`
- `createElement`
- `updateChildren`

![diff算法简析](https://img-blog.csdn.net/20180717182348969)