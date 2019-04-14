# Ajax

## Ajax, Axios, Fetch区别

1. jQuery Ajax

    - 针对`MVC`的编程设计,不符合现在前端`MVVM`的趋势
    - 基于原生的`XHR`开发，`XHR`本身的架构不够清晰
    - `jQuery`较大，单纯使用`ajax`却要引入整个`jQuery`非常的不合理

2. Axios

    - 从 `node.js` 创建 `http` 请求
    - 支持 `Promise` API
    - 客户端支持防止`CSRF`(跨站请求伪造)（请求中携带`cookie`）

      支持防止`CSRF`是怎么做到的呢? 就是让你的每个请求都带一个从`cookie`中拿到的`key`, 根据浏览器同源策略，假冒的网站是拿不到你`cookie`中得`key`的，这样，后台就可以轻松辨别出这个请求是否是用户在假冒网站上的误导输入，从而采取正确的策略。

    - **提供了一些并发请求的接口**

3. Axios

   - 更加底层，提供的API丰富（`request`, `response`）
   - 脱离了`XHR`，是`ES`规范里新的实现方式
   - `fetch`默认不会带`cookie`，需要添加配置项
   - `fetch`只对网络请求报错，对400，500都当做成功的请求，需要封装去处理
   - `fetch`不支持`abort`，不支持超时控制