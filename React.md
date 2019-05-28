# React

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