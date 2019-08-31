# hybrid

## hybrid解释

- hybrid 即"混合"
- 需前端开发人员和客户端开发人员配合开发
- 某些环节可能涉及到server端

## hybrid存在价值

- 可以快速迭代更新(无需app审核)
- 体验和Native app基本一致
- 减少开发和沟通成本，双端共用一套代码

## webview

- webview 是app中的一个组件
- 用于加载h5页面，是一个小型的浏览器内核

## hybrid具体实现

- 前端做好静态页面，将文件交给客户端
- 客户端拿到前端静态页面，以文件形式存储在app中
- 客户端在一个webview中
- 使用file协议加载静态页面

## hybrid更新流程

- 静态页面分版本，有版本号
- 将静态文件压缩成zip包，上传到服务端
- 客户端取每次启动，从server下载最新的静态文件（如果服务端版本号大于客户端版本号，就去下载最新的zip包）
- 客户端下载完之后解压包，然后替换现有文件

## hybrid和h5的区别

- 优点
  - 体验更好，跟NA基本一致
  - 可快速迭代更新，无需app审核
- 缺点
  - 开发成本高，联调，测试，查BUG比较麻烦
  - 运维成本高，更新上线流程繁琐
- 使用场景
  - hybrid：产品的稳定功能，体验要求高，迭代频繁，适用于产品型
  - h5: 单次的运营活动或不常用功能，适用于运营型

## JS和客户端通讯的基本形式

- JS访问客户端能力，传递参数和回调函数
- 客户端通过回调函数返回内容

## schema协议

``` javascript
(function (window ) {
    // 调用 schema 的封装
    function _invoke(action, data, callback) {
        // 拼装 schema 协议
        var schema = 'myapp://utils/' + action
        // 拼接参数
        schema += '?a=a'
        var key
        for (key in data) {
            if (data.hasOwnProperty(key)) {
                schema += '&' + key + data[key]
            }
        }
        // 处理 callback
        var callbackName = ''
        if (typeof callback === 'string') {
            callbackName = callback
        } else {
            callbackName = action + Date.now()
            window[callbackName] = callback
        }
        schema += 'callback=callbackName'

        // 触发
        var iframe = document.createElement('iframe')
        iframe.style.display = 'none'
        iframe.src = schema  // 重要！
        var body = document.body
        body.appendChild(iframe)
        setTimeout(function () {
            body.removeChild(iframe)
            iframe = null
        })
    }
    // 暴露到全局变量
    window.invoke = {
        share: function (data, callback) {
            _invoke('share', data, callback)
        },
        scan: function (data, callback) {
            _invoke('scan', data, callback)
        }
        login: function (data, callback) {
            _invoke('login', data, callback)
        }
    }

})(window)

window.invoke.scan()
window.invoke.share({
    title: 'title',
    content: ''
}, function(result) {
    alert('分享成功')
})
```
