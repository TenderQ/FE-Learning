# Ajax

## Http请求中常见的四种 ContentType

1. `application/json` 服务端消息主体是序列化后的 JSON 字符串, 适合 `RESTful` 的接口。
2. `text/xml` 它的使用多用于 WordPress 的 XML-RPC Api，搜索引擎的 ping 服务等等
3. `multipart/form-data` **表单上传文件**时，必须让 `form` 的 `enctyped` 等于这个值
4. `application/x-www-form-urlencoded` 最常见的 `POST` 提交数据的方式, 提交的数据按照 `key1=val1&key2=val2` 的方式进行编码

## Ajax, Axios, Fetch 区别

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

3. fetch

   - 更加底层，提供的 API 丰富（`request`, `response`）
   - 脱离了`XHR`，是`ES`规范里新的实现方式
   - `fetch`默认不会带`cookie`，需要添加配置项
   - `fetch`只对网络请求报错，对 400，500 都当做成功的请求，需要封装去处理
   - `fetch`不支持`abort`，不支持超时控制

## 用 Promise 封装 ajax

```js
function ajax(method, url, data) {
  return new Promise((resolve, reject) => {
    var xhr = new XMLHttpRequest()
    var method = method || 'get'
    var data = data || null
    xhr.open(method, url, true)
    xhr.send(data)
    xhr.onreadystatechange = function() {
      if (xhr.status === 200 && xhr.readyState === 4) {
        resolve(xhr.responseText)
      } else {
        reject(xhr.responseText)
      }
    }
  })
}
ajax('GET', '/data.json').then(result => {
    console.log(result)
})
```

## 跨域的方式

协议、域名、端口有任何一个不同，都被当作是不同的域

- jsonp （拥有'src'这个属性的标签都拥有跨域的能力）
- CORS 服务器设置`Access-Control-Allow-Origin`

## JSONP和callback

JSONP的原理是通过`<script>`标签发起一个GET请求来取代XHR请求。JSONP生成一个`<script>`标签并插到DOM中，然后浏览器会接管并向src属性所指向的地址发送请求。

JSONP的一个要点是允许用户传递一个`callback`参数给服务端，然后服务端返回数据时会将这个`callback`参数作为函数名来包裹住JSON数据，这样客户端就可以随意定制自己的函数来自动处理返回数据了。

jQuery 在每次跨域发送请求时都会有`callback`这个参数，这个参数的值就是回调函数名称，所以，服务器端在发送json数据时，应该把这个参数放到前面，这个参数的值往往是随机生成的，如：jsonp1294734708682，同时也可以通过 `$.ajax` 方法设置 `jsonpcallback` 方法的名称。服务器端应该这样发送数据：

``` java
String callback = Request.QueryString["callback"].ToString();
Response.Write(callback + "({\"userid\":0,\"username\":\"null\"})");
```

这样，json 数据 `{\"userid\":0,\"username\":\"null\"}` 就作为了 jsonp1294734708682 回调函数的一个参数

jQuery方式使用：

``` javascript
$.ajax({
  url: url,
  dataType: 'jsonp',
  data: 'username=admin&password=123',
  jsonp: 'successCallback', // 回掉函数名的参数名，默认callback，服务端通过它来获取到回掉函数名
  jsonpCallback: 'successCallback' // 回掉函数名，默认jquery自动生成
});

function successCallback(data) {
  console.log(data)
}

// 不指定回调函数
$.ajax({
  url: url,
  dataType: 'jsonp',
  data: 'username=admin&password=123',
  jsonp: 'callback',
  success: function (data) {
    console.log(data)
  }
})
```

## CORS

CORS（跨来源资源共享）是一份浏览器技术的规范，使用CORS，开发者可以使用普通的`XMLHttpRequest`发起请求和获得数据，比起JSONP有更好的错误处理

CORS背后的基本思想是使用自定义的HTTP头部允许浏览器和服务器相互了解对方，从而决定请求或响应成功与否

- `Access-Control-Allow-Origin`: 指定授权访问的域
- `Access-Control-Allow-Methods`：授权请求的方法（GET, POST, PUT, DELETE，OPTIONS等)

## cookie 跨域的处理方案

cookie是不能跨域访问的，但是在二级域名是可以共享cookie的

1. 通过设置cookie的属性实现不同子域间访问

   - `domain`-域: 通过设置这个属性可以使多个web服务器共享cookie。domain属性的默认值是创建cookie的服务器的主机名。不能将一个cookie的域设置成服务器所在的域之外的域。

   - `path`-路径: 表示创建该cookie的服务器的哪些路径下的文件有权限读取该 cookie,默认为/，就是创建该cookie的服务器的根目录

   比如:

   让位于a.taotao.com的服务器能够读取b.taotao.com设置的cookie值。如果b.taotao.com的页面创建的cookie**把path属性设置为`/`，把domain属性设置成".taotao.com"**，那么所有位于b.taotao.com的网页和所有位于 a.taotao.com的网页，以及位于taotao.com域的其他服务器上的网页都可以访问(或者说是获取)这个cookie。

2. 利用JSONP请求

3. 使用Nginx反向代理，暂不做介绍

## 跨域ajax请求，服务器会收到请求吗

服务器会接收到请求，但是因为同源策略浏览器在接收加载资源之前对其来源进行了检查，然后限制响应内容的加载

## 跨域请求传递Cookie问题

原因分析：是由浏览器的同源策略导致的问题：不允许JS访问跨域的Cookie。
举个例子，现有网站A使用域名a.example.com，网站B使用域名b.example.com，如果希望在2个网站之间共享Cookie（浏览器可以将Cookie发送给服务器），那么在设置的Cookie的时候，必须设置domain为example.com。

解决方案:

1. 服务器端使用CROS协议解决跨域访问数据问题时，需要设置响应消息头`Access-Control-Allow-Credentials`值为`true`。同时，还需要设置响应消息头`Access-Control-Allow-Origin`值为指定单一域名（注：不能为通配符“*”）。
2. 客户端需要设置`Ajax`请求属性`withCredentials=true`，让`Ajax`请求都带上`Cookie`

## 为什么form表单提交没有跨域问题，但ajax提交有跨域问题

原页面用 form 提交到另一个域名之后，原页面的脚本无法获取新页面中的内容。
所以浏览器认为这是安全的。而AJAX是可以读取响应内容的，浏览器不能允许你这样做。

浏览器同源策略的本质是，一个域名的JS，在未经允许的情况下，不得读取另一个域名的内容。但浏览器并不阻止你向另一个域名发送请求。
