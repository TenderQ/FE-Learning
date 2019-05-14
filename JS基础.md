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

- `call` `apply` `bind`都可以改变函数调用的`this`指向
- `call`跟`apply`的用法几乎一样，唯一的不同就是传递的参数不同，`call`只能一个参数一个参数的传入。
- `apply`只支持传入一个数组。最终调用函数时候这个数组会拆成一个个参数分别传入。
- `bind`返回值是函数, `bind` 方法不会立即执行，而是返回一个改变了上下文 `this` 后的函数。而原函数中的 `this` 并没有被改变。`bind`传参方式跟`call`方法一致

## JS原型链

[JS原型链简单图解](https://www.cnblogs.com/libin-1/p/5820550.html)

## 作用域链

1. 执行环境

   - 全局执行环境 可以认为是`window`对象，所有的全局变量和函数都是作为`window`对象的属性和方法创建的
   - 函数执行环境 每个函数都有自己的执行环境，当执行流进入一个函数时，函数的环境就被推入一个环境栈中，当函数执行完毕后，栈将其环境弹出，把控制权返回给之前的执行环境

2. 作用域

   - 全局作用域 可以在代码中的任何地方都能被访问，window对象的内置属性都拥有全局作用域
   - 局部作用域 只在固定的代码片段内可以访问得到

3. 作用域链

   - 全局作用域和局部作用域中变量的访问权限，其实是由作用域链决定的；作用域链是函数被创建的作用域中对象的集合。作用域链可以保证对执行环境有权访问的所有变量和函数的有序访问。

   - 作用域链的最前端始终是当前执行的代码所在环境的变量对象（如果该环境是函数，则将其活动对象作为变量对象），下一个变量对象来自包含环境（包含当前还行环境的环境），下一个变量对象来自包含环境的包含环境，依次往上，直到全局执行环境的变量对象。全局执行环境的变量对象始终是作用域链中的最后一个对象。

   - 函数的局部环境可以访问函数作用域中的变量，也可以访问和操作父环境（包含环境）乃至全局环境中的变量

   - 全局环境只能访问全局环境中定义的变量和函数，不能直接访问局部环境中的任何数据

4. 变量提升和函数提升

   - 变量提升 就是把变量提升到函数的顶部，需要注意的是，变量提升只是提升变量的声明，不会提升变量的值

    ``` js
    var n = 1
    function test(){
      console.log(n) // undefined
      var n = 2
    }
    test()
    console.log(n) // 1
    ```

   - 函数提升 把函数提升到作用域的最前面，只有函数声明形式才能被提升

    ``` js
    function test() {
      func()
      function func() {
        console.log('test string')
      }
    }
    test() // test string
    ```

## JS设计模式之发布订阅模式

### 发布订阅模式和观察者模式的概念

- 发布订阅模式，基于一个主题/事件通道，希望接收通知的对象（称为subscriber）通过自定义事件订阅主题，被激活事件的对象（称为publisher）通过发布主题事件的方式被通知。
- 观察者模式，一个对象（称为subject）维持一系列依赖于它的对象（称为observer），将有关状态的任何变更自动通知给它们（观察者）。**js中的事件监听机制就是一种观察者模式**

### 发布订阅模式和观察者模式的区别

1. 观察者模式要求观察者必须订阅内容改变的事件，定义了一个一对多的依赖关系
2. 发布订阅模式使用了一个主题/事件通道，这个通道介于订阅着与发布者之间
3. 观察者模式里面观察者「被迫」执行内容改变事件（subject内容事件）；发布/订阅模式中，订阅着可以自定义事件处理程序
4. 观察者模式两个对象之间有很强的依赖关系；发布/订阅模式两个对象之间是松散耦合的

   类似于买房者和卖房者之间的关系，发布订阅模式中发布者相当于卖房者，订阅者相当于买房者，发布订阅模式中存在一个房源中介者（即事件通道）。而观察者之间不存在中介，卖房的人一旦发布消息，买房者直接就能接收到

### 发布订阅模式实现

``` js
class Public {
  constructor() {
    this.handlers = {}
  }
  // 订阅事件
  on(eventName, handler) {
    if(!this.handlers[eventName]) {
      this.handlers[eventName] = []
    }
    this.handlers[eventName].push(handler)
    return this
  }
  // 触发事件(发布事件)
  emit(eventName) {
    let handlerArgs = Array.prototype.slice.call(arguments, 1)
    for(let i = 0; i < this.handlers[eventName].length; i++) {
      this.handlers[eventName][i].apply(this, handlerArgs)
    }
    return this
  }
  // 删除订阅事件
  off(eventName, handler) {
    let currentEvent = this.handlers[eventName]
    if (currentEvent) {
      for (var i = currentEvent.length - 1; i >= 0; i--) {
        if (currentEvent[i] === handler){
          currentEvent.splice(i, 1)
        }
      }
    }
    return this
  }
}

const Publisher = new Public()

//订阅事件a
Publisher.on('eventA', function(data) {
  console.log(1 + data)
})
Publisher.on('eventA', function(data) {
  console.log(2 + data)
})

// 发布事件a
Publisher.emit('eventA', ' test arguments')
```

### vue中订阅发布模式的作用

``` js
// 遍历传入实例的data对象的属性，将其设置为Vue对象的访问器属性
function observe(obj, vm){
  Object.keys(obj).forEach(function(key){
    defineReactive(vm, key, obj[key]);
  });
}
// 设置为访问器属性，并在其getter和setter函数中，使用订阅发布模式。互相监听
function defineReactive(obj, key, val){
  // 这里用到了观察者(订阅/发布)模式,它定义了一种一对多的关系，让多个观察者监听一个主题对象，这个主题对象的状态发生改变时会通知所有观察者对象，观察者对象就可以更新自己的状态。
  // 实例化一个主题对象，对象中有空的观察者列表
  var dep = new Dep();
  // 将data的每一个属性都设置为Vue对象的访问器属性，属性名和data中相同
  // 所以每次修改Vue.data的时候，都会调用下边的get和set方法。然后会监听v-model的input事件，当改变了input的值，就相应的改变Vue.data的数据，然后触发这里的set方法
  Object.defineProperty(obj,key,{
    get: function(){
      // Dep.target指针指向watcher，增加订阅者watcher到主体对象Dep
      if (Dep.target) {
        dep.addSub(Dep.target);
      }
      return val;
    },
    set: function(newVal){
      if(newVal === val){
          return
      }
      val = newVal;
      //给订阅者列表中的watchers发出通知
      dep.notify();
    }
  });
}
// 主题对象Dep构造函数
function Dep(){
  this.subs = [];
}
//Dep有两个方法，增加订阅者  和  发布消息
Dep.prototype = {
  addSub: function(sub){
    this.subs.push(sub);
  },
  notify: function(){
    this.subs.forEach(function(sub){
      sub.update();
    });
  }
}
```