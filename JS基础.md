# JS基础

## JS的数据类型

- 基本数据类型：`String`，`Boolean`，`Number`，`Undefined`，`Null`
- 引用数据类型：`Object(Array，Date，RegExp，Function)`
- 基本数据类型保存在栈内存中，引用数据类型保存在堆内存中

## JS判断数组的方式

- `obj instanceof Array`
- `Array.isArray(obj)`
- `Object.prototype.toString.call(obj) === '[object Array]'`

## JS深拷贝和浅拷贝

- 浅拷贝是指只复制一层对象，当对象的属性是引用类型时，实质复制的是其引用，当引用指向的值改变时也会跟着变化

  ``` js
    function extendCopy(object) {
      var result = {}
      for (var i in object) {
        result[i] = object[i]
      }
      return result
  　}

    // 另一种方案
    Object.assign({}, object)
  ```

- 深拷贝是指复制对象的所有层级

  ``` js
    function deepCopy(source) {
      if (!source) {
        return source
      }
      let sourceCopy = source instanceof Array ? [] : {}
      for (let item in source) {
        sourceCopy[item] =
          typeof source[item] === 'object' ? deepCopy(source[item]) : source[item]
      }
      return sourceCopy
    }

    // 另一种方案
    JSON.parse(JSON.stringify(object))
  ```

## 函数节流和函数去抖

原因：在开发过程中，会有这样的场景，事件被频繁的触发，比在输入的时候监控`keypress`事件，在页面滚动的时候监控页面的滚动事件, 如果事件处理中存在复杂的dom操作，可能会导致整个UI卡顿甚至浏览器奔溃，而我们希望的结果就是事件结束后处理函数执行一次就行了

- 函数节流：函数在事件执行的过程中有规律的调用, 减少函数执行次数
  
  ``` js
  function throttle(fn, duration = 0) {
    let beginTime = new Date()
    return function() {
      let nowTime = new Date()
      if (nowTime - beginTime >= duration) {
        fn.apply(this, arguments)
        beginTime = nowTime
      }
    }
  }
  // run test
  function handleScroll(){
    console.log(1)
  }
  window.onscroll = throttle(handleScroll)
  ```

- 函数防抖：函数在触发事件结束后一段时间内才会执行

  ```js
  function debounce(fn, delay) {
    let timer = null
    return function() {
      clearTimeout(timer)
      timer = setTimeout(() => {
        fn.apply(this, arguments)
      }, delay)
    }
  }
  ```

函数的节流和函数的去抖都是通过减少实际逻辑处理过程的执行来提高事件处理函数运行性能的手段，并没有实质上减少事件的触发次数。

## 柯里化函数实现

``` js
var currying = function(fn) {
  var args = Array.prototype.slice.call(arguments, 1);

  return function() {
    if (arguments.length === 0) {
      return fn.apply(this, args); // 没传参数时，调用这个函数
    } else {
      [].push.apply(args, arguments); // 传入了参数，把参数保存下来
      return arguments.callee; // 返回这个函数的引用
    }
  }
}

var cost = (function() {
  var money = 0;
  return function() {
    for (var i = 0; i < arguments.length; i++) {
      money += arguments[i];
    }
    return money;
  }
})();

var cost = currying(cost, 100);
cost(200); // 传入了参数，不真正求值
cost(300); // 传入了参数，不真正求值

console.log(cost()); // 输出600
```

柯里化函数用来：

- 延迟计算
- 参数复用
- 动态生成函数

## bind,call,apply三者的区别

bind返回值是函数,bind 方法不会立即执行，而是返回一个改变了上下文 this 后的函数。而原函数 printName 中的 this 并没有被改变，依旧指向全局对象 window。

[call、apply、bind的区别](https://segmentfault.com/a/1190000012772040#articleHeader2)

## JS原型链

[JS原型链简单图解](https://www.cnblogs.com/libin-1/p/5820550.html)