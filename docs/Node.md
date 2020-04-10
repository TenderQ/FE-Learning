## Koa2的洋葱模型实现原理

Koa的洋葱模型

![洋葱模型](https://segmentfault.com/img/bV6DZG?w=478&h=435)

demo

``` js
const Koa = require('koa');
const app = new Koa();
const PORT = 3000;
// #1
app.use(async (ctx, next)=>{
    console.log(1)
    await next();
    console.log(1)
});

// #2
app.use(async (ctx, next) => {
    console.log(2)
    await next();
    console.log(2)
})

app.use(async (ctx, next) => {
    console.log(3)
})

app.listen(PORT);
console.log(`http://localhost:${PORT}`);
```

访问http://localhost:3000，控制台打印：

``` js
1
2
3
2
1
```

koa2 会将注册的所有中间件函数，放在数组`middleware`中，使用`koa-compose`,处理`moddleware`这个数组

以下是`compose`源码的解析:

``` js
function compose(middleware) {
  // 容错判断，如果middleware不是数组，或者元素不是函数，则抛异常
  if (!Array.isArray(middleware))
    throw new TypeError('Middleware stack must be an array!');
  for (const fn of middleware) {
    if (typeof fn !== 'function')
      throw new TypeError('Middleware must be composed of functions!');
  }

  // compose函数最终返回一个闭包函数
  return function(context, next) {
    // last called middleware #
    let index = -1;
    return dispatch(0);
    // 使用递归操作，将各个function作为前一个function的next参数传递过去
    function dispatch(i) {
      if (i <= index)
        return Promise.reject(new Error('next() called multiple times'));
      index = i;
      let fn = middleware[i];
      if (i === middleware.length) fn = next;
      if (!fn) return Promise.resolve();
      try {
        // 将context一路传下去给中间件
        return Promise.resolve(fn(context, dispatch.bind(null, i + 1)));
      } catch (err) {
        return Promise.reject(err);
      }
    }
  };
}
```

