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

### 为什么建议传递给 setState 的参数是一个 callback 而不是一个对象

`this.props` 和 `this.state` 的更新可能是异步的，不能依赖它们的值去计算下一个 `state`。

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

## React diff原理

1. 把树形结构按照层级分解，只比较同级元素

2. 给列表结构的每个单元添加唯一的 `key` 属性，方便比较

3. `react` 只会匹配相同 `class` 的 `component`（这里面的 `class` 指的是组件的名字）

4. 合并操作，调用 `component` 的 `setState` 方法的时候, `React` 将其标记为 `dirty`.到每一个事件循环结束, `React` 检查所有标记 `dirty` 的 `component` 重新绘制

5. 选择性子树渲染。开发人员可以重写 `shouldComponentUpdate` 提高 diff 的性能

## React中PureComponent

`PureComponent` 是优化 `React` 应用程序最重要的方法之一，易于实施，只要把继承类从 `Component` 换成 `PureComponent` 即可，可以减少不必要的 `render` 操作的次数，从而提高性能，而且可以少写 `shouldComponentUpdate` 函数，节省代码

### 原理

当组件更新时，如果组件的 `props` 和 `state` 都没发生改变， `render` 方法就不会触发，省去`Virtual DOM`的生成和比对过程，达到提升性能的目的。具体就是 `React` 自动帮我们做了一层浅比较：

``` javascript
if (this._compositeType === CompositeTypes.PureClass) {
    shouldUpdate = !shallowEqual(prevProps, nextProps) || !shallowEqual(inst.state, nextState);
}
```

`shallowEqual`会比较 `Object.keys(state | props)` 的长度是否一致，每一个 `key` 是否两者都有，并且是否是一个引用，也就是只比较了第一层的值，确实很浅，所以**深层的嵌套数据是对比不出来的**。

### 问题

当一个数据是不变数据时，可以使用一个引用。但是对于一个易变数据来说(比如数组)，不能使用引用的方式给到`PureComponent`。简单来说，就是我们在`PureComponent`外层来修改其使用的数据时，应该给其赋值一个新的对象或者引用，从而才能确保其能够进行重新渲染

``` javascript
this.setState(prevState => ({
    state: [...prevState.state, 'new state'],
}));
```

`PureComponent`真正起作用的，只是在一些纯展示组件上，复杂组件使用的话`shallowEqual`那一关基本就过不了。另外在使用的过程中为了确保能够正确的渲染，记得 `props` 和 `state` 不能使用同一个引用

## Redux的原理

`Redux`是将整个应用状态存储到一个地方上称为`store`,里面保存着一个状态树`store tree`,组件可以派发(`dispatch`)行为(`action`)给`store`, 而不是直接通知其他组件，组件内部通过订阅`store`中的状态`state`来刷新自己的视图

### Redux三大原则

1. 唯一数据源

    整个应用的`state`都被存储到一个状态树里面，并且这个状态树，只存在于唯一的`store`中

2. 保持只读状态

    `state`是只读的，唯一改变`state`的方法就是触发`action`，`action`是一个用于描述以发生时间的普通对象

3. 数据改变只能通过纯函数来执行

    使用纯函数来执行修改，为了描述`action`如何改变`state`的，需要编写`reducers`

### Redux核心概念

- Store

`store`是保存数据的地方，可以把它看成一个数据，整个应用只能有一个`store`, `Redux`提供`createStore`这个函数，用来生成`store`

``` javascript
import {createStore} from 'redux;
const store = createStore(reducer);
```

- State

`state`是`store`里面存储的数据，`store`里面可以拥有多个`state`，`Redux`规定一个`state`对应一个`View`,只要`state`相同，`view`就是一样的，反过来也是一样的，可以通过`store.getState()`获取

``` javascript
const state = store.getState()
```

- Action

`state`的改变会导致`View`的变化，但是在`redux`中不能直接操作`state`也就是说不能使用`this.setState`来操作，用户只能接触到`View`。在`Redux`中提供了一个对象来告诉`Store`需要改变`state`。`Action`是一个对象, 其中`type`属性是必须的，表示`Action`的名称。发送Action的唯一办法是`store.dispatch(Action)`

 ``` javascript
const action = {
    type: 'ADD_TODO',
    payload: 'do something'
}
```

- Reducer

`Store`收到`Action`后，必须给出一个新的`state`，这样`view`才会发生变化。这种`state`的计算过程就叫做`Reducer`。

> 注意：`Reducer`必须是一个纯函数，也就是说函数返回的结果必须由参数`state`和`action`决定，而且不产生任何副作用也不能修改`state`和`action`对象

``` javascript
const reducer = (state, action)=>{
    switch(action.type) {
        case ADD_TODO:
            return newstate;
        default
            return state;
    }
}
```

### 何为纯函数

一个函数的返回结果只依赖于它的参数，并且在执行过程里面没有副作用，我们就把这个函数叫做纯函数。

- 函数的返回结果只依赖于它的参数

``` javascript
const foo = (obj, b) => {
  return obj.x + b
}
const counter = { x: 1 }
foo(counter, 2) // => 3
counter.x // => 1
```

foo函数里面传一个对象进行计算，计算的过程里面并不会对传入的对象进行修改，计算前后的 `counter` 对象不会发生任何变化，计算前x是 1，计算后也是 1，所以foo是纯函数

## Redux Thunk 的作用

`Redux thunk` 是一个允许你编写返回一个函数而不是一个 `action` 的 `actions creators` 的中间件。如果满足某个条件，`thunk` 则可以用来延迟 `action` 的派发(`dispatch`)，这可以处理异步 `action` 的派发(`dispatch`)。

## React对Context的理解

`Context` 提供了一个无需为每层组件手动添加 `props`，就能在组件树间进行数据传递的方法。`Context` 设计目的是为了共享那些对于一个组件树而言是“全局”的数据，例如当前认证的用户、主题或首选语言

- `React.createContext`：创建一个上下文的容器(组件), defaultValue可以设置共享的默认数据

``` js
const {Provider, Consumer} = React.createContext(defaultValue);
```

- `Context.Provider`(生产者): 用于生产共享数据的地方。`Provider` 接收一个 `value` 属性，传递给消费组件，`value`放置共享的数据

``` js
<Provider value={/*共享的数据*/}>
    /*里面可以渲染对应的内容*/
</Provider>
```

- `Context.Consumer`(消费者): 是专门消费供应商`(Provider`)产生数据。`Consumer`需要嵌套在生产者下面。才能通过回调的方式拿到共享的数据源。当然也可以单独使用，那就只能消费到创建content时的`defaultValue`

``` js
<Consumer>
  {value => /*根据上下文  进行渲染相应内容*/}
</Consumer>
```

## React 中 refs 的作用

`refs` 是 `React` 提供安全访问 `DOM` 元素或者某个组件实例的句柄。我们可以为元素添加 `ref` 属性然后在回调函数中接受该元素在 `DOM` 树中的句柄，该值会作为回调函数的第一个参数返回

``` js
render () {
    return (
        <form>
            <input type='text' ref={(input) => this.input = input} />
        </form>
    )
}
```

`ref` 属性声明的回调函数接收 `input` 对应的 `DOM` 元素，将其绑定到 `this.input` 上

## react-router的使用

- `BrowserRouter`或`HashRouter`用来渲染`Router`所代表的组件

- `Route`用来匹配组件路径并且筛选需要渲染的组件

- `Switch`用来筛选需要渲染的唯一组件

- `Link`直接渲染某个页面组件

- `Redirect`类似于`Link`，在没有`Route`匹配成功时触发

## React 事件机制

react的事件是合成事件，不是原生事件

``` html
<button onClick={this.handleClick}></button>

<input value={this.state.name} onChange={this.handleChange} />
```

### 合成事件与原生事件的区别

1. 写法不同，合成事件是驼峰写法，而原生事件是全部小写
2. 执行时机不同，合成事件全部委托到`document`上，而原生事件绑定到`DOM`元素本身
3. 合成事件中可以是任何类型，比如`this.handleClick`这个函数，而原生事件中只能是字符串

### React合成事件执行过程

原生事件冒泡到document层 -> react实例化event为合成事件 -> event对象交由对应的处理器执行

    对于冒泡事件，是在 document 对象的冒泡阶段触发。对于非冒泡事件，例如focus，blur，是在 document 对象的捕获阶段触发，最后在 派发事件 中决定真正回调函数的执行

合成事件和DOM事件混合使用，触发顺序是：

1. 先执行原生事件，事件冒泡至`document`，再执行合成事件
2. 如果是父子元素，触发顺序为 子元素原生事件 -> 父元素原生事件 -> 子元素合成事件 -> 父元素合成事件

### React组件中使用原生事件

由于原生事件绑定在真实DOM上，所以一般是在`componentDidMount`中或`ref`回调函数中进行绑定操作，在`componentWillUnmount`阶段进行解绑操作，以避免内存泄漏。

``` javascript
componentDidMount() {
    //获取当前真实DOM元素
    const thisDOM = ReactDOM.findDOMNode(this);
    //或者
    const thisDOM = this.refs.el;
    thisDOM.addEventListener('click', this.onDOMClick, false);
}
componentWillUnmount() {
    //卸载时解绑事件，防止内存泄漏
    const thisDOM = ReactDOM.findDOMNode(this);
    thisDOM.removeEventListener('click',this.removeDOMClick);
}
onDOMClick(e){
    console.log(e)
}
render(){
    return(
        <div ref="el"> 单击原始事件触发 </div>
    )
}
```
