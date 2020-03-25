# JS基础

## JS的数据类型

- 基本数据类型：`String`，`Boolean`，`Number`，`Undefined`，`Null`
- 引用数据类型：`Object(Array，Date，RegExp，Function)`
- 基本数据类型保存在栈内存中，引用数据类型保存在堆内存中

## JS判断数组的方式

- `obj instanceof Array`
  使用`instanceof`判断一个对象是否为数组，`instanceo`f 会判断这个对象的原型链上是否会找到对应的 Array 的原型，找到返回 true，否则返回 false。但`instanceof` 只能用来判断对象类型，原始类型不可以。并且所有对象类型 `instanceof Object` 都是 true。
- `Array.isArray(obj)`
  当检测Array实例时，`Array.isArray` 优于 `instanceof`，因为 `Array.isArray` 可以检测出 iframes
- `Object.prototype.toString.call(obj) === '[object Array]'`
  这种方法对于所有基本的数据类型都能进行判断，即使是 null 和 undefined。Object.prototype.toString.call() 常用于判断浏览器内置对象时

## 类数组转换为数组的方法

``` javascript
Array.prototype.slice.call(arguments);
```

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
    function deepCopy(obj, hash = new WeakMap()) {
      if (obj instanceif RegExp) return new RegExp(obj)
      if (obj instanceif Date) return new Date(obj)
      if (!obj || typeof obj !== 'object') {
        return obj
      }
      if (hash.has(obj)) {
        return hash.get(obj)
      }
      let objCopy = new obj.constractor();
      hash.set(obj, objCopy);
      for (let key in obj) {
        if (obj.hasOwnProperty(key)) {
          objCopy[key] = deepClone(obj[key], hash)
        }
      }
      return objCopy
    }

    // 另一种方案
    JSON.parse(JSON.stringify(object))
  ```

## 函数节流和函数防抖

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
- `call`比`apply`的性能要好, `call`传入参数的格式正是内部所需要的格式

## 原生JS实现bind函数

``` js
Function.prototype.bind = function (func) {
  var params = [].slice.call(arguments, 1)
  var that = this
  return function () {
    that.apply(func, params.concat([].slice.call(arguments, 0)))
  }
}
```

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

## 写一个数组方法, 打乱整个数组顺序, 并且每个数字落在各个位置的概率相同

``` js
function shuffle(arr) {
  let i = arr.length
  while (i) {
    let j = Math.floor(Math.random() * i--)
    [arr[j], arr[i]] = [arr[i], arr[j]] // 交换数组顺序
  }
  return arr
}
```

## JavaScript垃圾回收机制

1. 标记清除（mark and sweep）

   大部分浏览器以此方式进行垃圾回收，当变量进入执行环境（函数中声明变量）的时候，垃圾回收器将其标记为“进入环境”，当变量离开环境的时候（函数执行结束）将其标记为“离开环境”，在离开环境之后还有的变量则是需要被删除的变量。标记方式不定，可以是某个特殊位的反转或维护一个列表等。

   垃圾收集器给内存中的所有变量都加上标记，然后去掉环境中的变量以及被环境中的变量引用的变量的标记。在此之后再被加上的标记的变量即为需要回收的变量，因为环境中的变量已经无法访问到这些变量。

2. 引用计数(reference counting)

   引用计数的含义是跟踪记录每个值被引用的次数。当声明了一个变量并将一个引用类型赋值给该变量时，则这个值的引用次数就是1。相反，如果包含对这个值引用的变量又取得了另外一个值，则这个值的引用次数就减1。当这个引用次数变成0时，则说明没有办法再访问这个值了，因而就可以将其所占的内存空间给收回来。这样，垃圾收集器下次再运行时，它就会释放那些引用次数为0的值所占的内存。

## JavaScript内存泄露的场景

- `XMLHttpRequest` 泄漏发生在IE7-8,释放方法，将`XMLHttpRequest`实例对象设置为Null；
- `DOM`&`BOM`等对象循环绑定 泄漏发生在IE6-8，释放方法，切断循环引用，将对对象的应用设置为Null
- 定时器(严格上说不能算是泄露，是被闭包持有了，是正常的表现)，对于闭包中无用的变量可以使用`delete`操作符进行释放；

## 事件模型

- 事件捕获阶段(capturing phase)。事件从document一直向下传播到目标元素, 依次检查经过的节点是否绑定了事件监听函数，如果有则执行
- 事件处理阶段(target phase)。事件到达目标元素, 触发目标元素的监听函数
- 事件冒泡阶段(bubbling phase)。事件从目标元素冒泡到document, 依次检查经过的节点是否绑定了事件监听函数，如果有则执行

## 事件模型中事件捕捉和事件冒泡的执行顺序

W3C模型规定任何事件首先会被捕获直到遇到目标元素，然后再向上返回。 也就是说事件是先进行事件捕捉，再进行事件冒泡。

### 如何让事件先冒泡后捕获

对于同一个事件，监听捕获和冒泡，分别对应相应的处理函数，监听到捕获事件，先暂缓执行，直到冒泡事件被捕获后再执行捕获之间。或者使用订阅发布模式，在捕获阶段中订阅事件处理方法，在冒泡阶段发布事件

## JS去除小数位

- parseInt(3.1415)
- 3.1415 >> 0

## JS实现按照指定长度为数字前面补零

``` js
function PrefixInteger(num, length) {
  return (Array(length).join('0') + num).slice(-length);
}
```

## 如何解决异步回调地狱

- `promise`
- `generator`
- `async/await`

## JS函数声明与函数表达式的区别

``` js
// 函数声明
function sum (num1, num2) {
  return num1 + num2;
}
// 函数表达式
var sum = function (num1, num2) {
  return num1 + num2;
}
```

1. 以函数声明的方法定义的函数，函数名是必须的，而函数表达式的函数名是可选的
2. 以函数声明的方法定义的函数，函数可以在函数声明之前调用，而函数表达式的函数只能在声明之后调用
3. 以函数声明的方法定义的函数并不是真正的声明，他们仅仅可以出现在全局中或者嵌套在其它函数中,但是它们不能出现在循环,条件或者try/catch/finally中,而函数表达式可以在任何地方声明.

## new()到底做了些什么

创建一个新实例，必须使用 `new` 操作符。以这种方式调用构造函数实际上会经历以下步骤：

1. 创建一个新对象；
2. 将构造函数的作用域赋给新对象（因此 this 就指向了这个新对象）
3. 执行构造函数中的代码（为这个新对象添加属性）
4. 返回新对象

动手实现

``` js
const newMethod = function (Func, ...rest) {
  var obj = {};
  obj.__proto__ = Func.prototype;
  Func.apply(obj, rest);
  return Func;
};

const newMethod2 = function (Func, ...rest) {
  // 1.以构造器的prototype属性为原型，创建新对象；
  let obj = Object.create(Func.prototype);
  // 2.将this和调用参数传给构造器执行
  Func.apply(obj, rest);
  // 3.返回第一步的对象
  return obj;
};
```
