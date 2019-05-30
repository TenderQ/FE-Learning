# React

## React和Vue对比

- 相同点:

    1. 数据驱动视图，提供响应式的视图组件
    2. 都有Virtual DOM，组件化开发，通过`props`参数进行父子组件数据的传递，都实现`webComponents`规范
    3. 数据流动单向
    4. 都支持服务端渲染(SSR)
    5. 都有支持`native`的方案，React的`React native`，Vue的`weex`

- 不同点：

    1. 社区：React社区还是要比vue大很多
    2. 开发模式：React在view层侵入性要比Vue大很多的, React严格上只针对MVC的view层，Vue则是MVVM模式的一种实现
    3. 数据绑定：Vue有实现*双向数据绑定*，React数据流动是*单向*的
    4. 数据渲染：对于大规模数据渲染，React要比Vue更快，渲染机制启动时候要做的工作比较多；
    5. 数据更新方面：Vue 由于采用依赖追踪，默认就是优化状态：你动了多少数据，就触发多少更新，不多也不少。React在复杂的应用里有两个选择:
    (1). 手动添加 `shouldComponentUpdate` 来避免不需要的 `vdom re-render`。 (2).Components 尽可能都用 `pureRenderMixin`，然后采用 `redux` 结构 + `Immutable.js`
    6. 开发风格的偏好：React 推荐的做法是 `JSX + inline style`，也就是把 HTML 和 CSS 全都写进 JavaScript，即"all in js"；Vue进阶之后推荐的是使用 `webpack + vue-loader`的单文件组件格式，即html, css, js写在同一个文件；
    7. 使用场景：React配合Redux架构适合超大规模多人协作的复杂项目; Vue则适合小快灵的项目。对于需要对 DOM 进行很多自定义操作的项目，Vue 的灵活性优于 React；
    8. Vue要比React更好上手，具体可能体现在很多人不熟悉React的JSX语法和函数式编程的思想，以及想要发挥出React的最大威力需要学习它一系列生态的缘故；
    9. Vue着重提高开发效率,让前端程序员更快速方便的开发应用。React着重于变革开发思想，提升前端程序员编程的深度与创造力,让前端工程师成为真正的程序员而不是UI的构建者；

## React setState的分析

### 为什么直接修改`this.state`无效

`setState`本质是通过一个队列机制实现`state`更新的。执行`setState`时，会将需要更新的`state`合并后放入状态队列，而不会立刻更新`state`，队列机制可以批量更新`state`。如果不通过`setState`而直接修改`this.stat`e，那么这个`state`不会放入状态队列中，下次调用`setState`时对状态队列进行合并时，会忽略之前直接被修改的`state`，这样就无法合并修改，而且实际也没有更新想要的`state`

### setState的认知

    1. `setState`不会立刻改变`React`组件中`state`的值
    2. `setState`通过触发一次组件的更新来引发重绘
    3. 多次`setState`函数调用产生的效果会合并

### setState之后的操作

React在`setState`之后，会经对`state`进行`diff`，判断是否有改变，然后去`diff dom`决定是否要更新UI。如果这一系列过程立刻发生在每一个`setState`之后，就可能会有性能问题。在短时间内频繁`setState`, `React`会将`state`的改变压入栈中，在合适的时机，批量更新`state`和视图，达到提高性能的效果。

> React会将`setState`的效果放在队列中，积攒着一次引发更新过程。为的就是把`Virtual DOM`和`DOM Tree`操作降到最小，用于提高性能。

### setState 什么时候会执行同步更新

在React中，如果是由React引发的事件处理（比如通过onClick引发的事件处理），调用`setState`不会同步更新`this.state`，除此之外(通过`addEventListener`添加的事件处理函数, 或者`setTimeout`,`setInterval`异步调用)的`setState`调用会同步执行`this.state`。

## React组件的生命周期

React组件的生命周期可以分为三个阶段：

1. 挂载阶段

    在这个过程中，会触发以下几个事件:

    - `getDefaultProps`: 设置默认属性
    - `getInitialState`: 设置初始状态
    - `componentWillMount`: 即将挂载
    - `render`: 渲染，就是挂载
    - `componentDidMount`: 组件挂载完成
  
2. 更新阶段

    更新过程中触发了如下钩子（方法）：

    - `compoentwillReceiveProps`: 即将接受上一级的属性传递- 比较少用
    - `shouldCompnetUpdate`: 是否应该进行更新操作
    - `componentWillUpdate`: 即将进行更新操作
    - `render`: 重新渲染
    - `componentDidUpdate`: 更新完成

3. 卸载阶段

    在组件卸载的时候，进入卸载阶段。只有一个钩子方法 `componentWillUnmount`

    `ReactDOM`提供了一个方法用于卸载组件 `ReactDOM.unmountComponentAtNode(document.getElementById('app'));`

> `render`在挂载阶段和更新阶段都会执行。挂载阶段只执行一次，但是更新阶段可以重复执行