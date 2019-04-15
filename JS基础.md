# JS基础

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