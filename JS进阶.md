# JS进阶

## jQuery中的bind(),live(),delegate(),on()绑定事件方式的区别

- `bind()`方法用于对匹配的元素进行特定事件的绑定。它直接绑定在现有的元素节点上，也很好的解决了浏览器在事件处理中的兼容问题。bind会触发元素事件冒泡，而且它不会绑定到在执行完后动态添加的元素上，元素过多时，会出现性能问题

- `live()`是事件委托的方式来执行，把节点的处理委托给了`document`，向当前或未来的匹配元素添加事件处理器。一旦事件冒泡到`document`上，`jQuery`将会查找`selector/event metadata`,然后决定哪个handler应该被调用。当handler在执行的时候，因为有冒泡的参与，确实会有一些延迟，但是绑定的时候是特别的快。和`bind()`相比好处就是我们不需要在每个元素上再去绑定事件，而只在document上绑定一次就可以了。
- `delegate()`则是更精确的小范围使用事件代理，性能优于`live()`。它不会把所有的`event`全部绑定到`document`,而是可以自行选择它要附加的DOM元素
- `on()`绑定事件处理程序到当前选定的`jQuery`对象中的元素。它是在1.7版本中被提出来的，提供绑定事件处理程序所需的所有功能。用于替换 `bind()`、`delegate()`和 `live()`。

## XSS与CSRF

- `XSS`是一种跨站脚本攻击，是属于代码注入的一种，攻击者通过将代码注入网页中，其他用户看到会受到影响(代码内容有请求外部服务器);

- `CSRF`是一种跨站请求伪造，冒充用户发起请求，完成一些违背用户请求的行为(删帖，改密码，发邮件，发帖等)

- 防御方法:

  - 对一些关键字和特殊字符进行过滤(<>,?,script等)，或对用户输入内容进行URL编码(`encodeURIComponent`)
  - `cookie`不要存放用户名和密码，对`cookie`信息进行MD5等算法散列存放，必要时可以将`IP`和`cookie`绑定

## Canvas性能优化

1. 离屏渲染

   在离屏Canvas上预渲染相似的图形或重复的对象，通俗的解释是将离屏canvas当成预渲染，在离屏canvas上绘制好一整块图形，绘制好后在放到视图canvas中，适合每一帧画图运算复杂的图形

    ``` js
    // 在离屏 canvas 上绘制
    var cacheCanvas = document.createElement('canvas')
    // 宽高赋值为想要的图片尺寸
    cacheCanvas.width = dWidth
    cacheCanvas.height = dHeight
    // 将image裁剪之后放到离屏canvas保存起来
    cacheCanvas.getContext('2d').drawImage(image, sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight)
    // 在视图canvas中绘制
    viewContext.drawImage(cacheCanvas, x, y)
    ```

2. 分层画布

   多个相互重叠的canvas根据变化程度分开渲染，越复杂的场景越适合

3. 一次性绘制

   绘制操作的性能开销较高，可以创建一个包含所有线条的路径，然后通过单个绘制路径调用进行绘制。在绘制复杂路径时，最好将所有点都放入路径中，而不是分别呈现各个片段

4. 使用requestAnimationFrame执行动画

   canvas动画的本质是不断地擦除和重绘，再结合一些时间控制的方法达到动画的目的；显示器刷新频率是60Hz，最平滑动画的最佳循环间隔是1000ms/60，约等于16.6ms；而`requestAnimationFrame`就是根据显示器刷新频率来的，这是浏览器专门为动画提供的API，在运行时浏览器会自动优化方法的调用，节省系统资源，提高系统性能，如果页面不是激活状态下的话，`requestAnimationFrame` 会被暂停调用以提升性能和电池寿命

5. 清空画布
  
   三种方法性能，性能依次提高

   ``` js
    context.fillRect()
    context.clearRect()
    canvas.width = canvas.width // 一种画布专用的技巧
   ```

6. 减少调用canvas的api

   比如像背景可以使用css属性设置或者img标签加一些定位什么的, 画布的缩放可以使用CSS transforms，不要将小画布放大，而是去将大画布缩小

7. 避免使用浮点数坐标

   使用非整数的坐标绘制内容，系统会自动使用抗锯齿功能，尝试对线条进行平滑处理，这又是一种性能消耗。可以调用 Math.round 四舍五入取整

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

## 服务端渲染(SSR)

服务端渲染（SSR）是将组件或页面通过服务器生成html字符串，再发送到浏览器，最后将静态标记"混合"为客户端上完全交互的应用程序

服务端渲染的模式下，当用户第一次请求页面时，由服务器把需要的组件或页面渲染成 HTML 字符串，然后把它返回给客户端。客户端拿到手的，是可以直接渲染然后呈现给用户的 HTML 内容，不需要为了生成 DOM 内容自己再去跑一遍 JS 代码。使用服务端渲染的网站，可以说是“所见即所得”，页面上呈现的内容，我们在 html 源文件里也能找到。

### 使用SSR的好处

1. 更利于SEO

   使用了React或者其它MVVM框架之后，页面大多数DOM元素都是在客户端根据js动态生成，可供爬虫抓取分析的内容大大减少。另外，浏览器爬虫不会等待数据完成之后再去抓取页面数据。服务端渲染返回给客户端的是已经获取了异步数据并执行JavaScript脚本的最终HTML，网络爬中就可以抓取到完整页面的信息。

2. 更利于首屏渲染

   首屏的渲染是后台发送过来的html字符串，并不依赖于js文件，这就会使用户更快的看到页面的内容。尤其是针对大型单页应用，打包后文件体积比较大，普通客户端渲染加载所有所需文件时间较长，首页就会有一个很长的白屏等待时间。

### 使用SSR的局限

1. 服务端压力较大

   本来是通过客户端完成渲染，现在统一到服务端node服务去做。尤其是高并发访问的情况，会大量占用服务端CPU资源；

2. 开发条件受限

   在服务端渲染中，React只会执行到`componentDidMount`之前的生命周期钩子，因此项目引用的第三方的库也不可用其它生命周期钩子，这对引用库的选择产生了很大的限制；

3. 学习成本相对较高

   除了对webpack、React要熟悉，还需要掌握node、Koa2等相关技术。相对于客户端渲染，项目构建、部署过程更加复杂

## PWA

PWA(Progressive Web App)即渐进式增强WEB应用。目的是在移动端利用提供的标准化框架，在网页应用中实现和原生应用相近的用户体验的渐进式网页应用。

一个 PWA 应用首先是一个网页, 可以通过 Web 技术编写出一个网页应用. 随后添加上 App Manifest 和 Service Worker 来实现 PWA 的安装和离线等功能

### 优势

1. 无需安装，无需下载，只要你输入网址访问一次，然后将其添加到设备桌面就可以持续使用。
2. 发布不需要提交到app商店审核
3. 更新迭代版本不需要审核，不需要重新发布审核
4. 现有的web网页都能通过改进成为PWA， 能很快的转型，上线，实现业务、获取流量
5. 不需要开发Android和IOS两套不同的版本

### 劣势

1. 游览器对技术支持还不够全面， 不是每一款游览器都能100%的支持所有PWA
2. 需要通过第三方库才能调用底层硬件（如摄像头）

## JS设计模式之工厂模式

工厂模式是用来创建对象的一种最常用的设计模式。不暴露创建对象的具体逻辑，而是将逻辑封装在一个函数中，那么这个函数就可以被视为一个工厂。
工厂模式根据抽象程度的不同可以分为：简单工厂，工厂方法和抽象工厂

### 简单工厂模式

``` js
let Shop = function () { };
Shop.prototype = {
  sell: function (model) {
    let goods;
    switch (model) {
      case "A"://A类型的商品
        goods = new A();
        break;
      case "B":
        goods = new B();
        break;
      case "C":
        goods = new C();
        break;
    }
    return goods;
  }
}
```

简单工厂的优点在于，你只需要一个正确的参数，就可以获取到你所需要的对象，而无需知道其创建的具体细节。但是在函数内包含了所有对象的创建逻辑（构造函数）和判断逻辑的代码，每增加新的构造函数还需要修改判断逻辑代码。当我们的对象不是上面的3个而是30个或更多时，这个函数会成为一个庞大的超级函数，便得难以维护。所以，简单工厂只能作用于创建的对象数量较少，对象的创建逻辑不复杂时使用。

### 工厂方法模式

先定义一个工厂接口，这个接口定义了一个工厂方法来创建某一类型的产品，然后有任意数量的具体工厂来实现这个接口，在各自的工厂方法里创建那个类型产品的具体实例

``` js
//安全模式创建的工厂方法函数
let UserFactory = function(role) {
  if(this instanceof UserFactory) {
    var s = new this[role]();
    return s;
  } else {
    return new UserFactory(role);
  }
}

//工厂方法函数的原型中设置所有对象的构造函数
UserFactory.prototype = {
  SuperAdmin: function() {
    this.name = "超级管理员",
    this.viewPage = ['首页', '通讯录', '发现页', '应用数据', '权限管理']
  },
  Admin: function() {
    this.name = "管理员",
    this.viewPage = ['首页', '通讯录', '发现页', '应用数据']
  },
  NormalUser: function() {
    this.name = '普通用户',
    this.viewPage = ['首页', '通讯录', '发现页']
  }
}

//调用
let superAdmin = UserFactory('SuperAdmin')
let admin = UserFactory('Admin')
let normalUser = UserFactory('NormalUser')
```

### 抽象工厂模式

简单工厂模式和工厂方法模式都是直接生成实例，但是抽象工厂模式不同，抽象工厂模式并不直接生成实例， 而是用于对产品类簇的创建。让工厂方法模式里的工厂接口定义一系列的方法来创建一系列的产品，就成了抽象工厂

``` js
let AccountAbstractFactory = function(subType, superType) {
  //判断抽象工厂中是否有该抽象类
  if(typeof AccountAbstractFactory[superType] === 'function') {
    //缓存类
    function F() {};
    //继承父类属性和方法
    F.prototype = new AccountAbstractFactory[superType] ();
    //将子类的constructor指向子类
    subType.constructor = subType;
    //子类原型继承父类
    subType.prototype = new F();
  } else {
    throw new Error('抽象类不存在!')
  }
}
//微信用户抽象类
AccountAbstractFactory.WechatUser = function() {
  this.type = 'wechat';
}
AccountAbstractFactory.WechatUser.prototype = {
  getName: function() {
    return new Error('抽象方法不能调用');
  }
}
//普通微信用户子类
function UserOfWechat(name) {
  this.name = name;
  this.viewPage = ['首页', '通讯录', '发现页']
}
//抽象工厂实现WechatUser类的继承
AccountAbstractFactory(UserOfWechat, 'WechatUser');
//子类中重写抽象方法
UserOfWechat.prototype.getName = function() {
  return this.name;
}
//实例化微信用户
let wechatUserA = new UserOfWechat('微信小李');
console.log(wechatUserA.getName(), wechatUserA.type); //微信小李 wechat
let wechatUserB = new UserOfWechat('微信小王');
console.log(wechatUserB.getName(), wechatUserB.type); //微信小王 wechat
```

## JS设计模式之装饰者模式

> 装饰者(decorator)模式能够在不改变对象自身的基础上，在程序运行期间给对像动态的添加职责（方法或属性）。与继承相比，装饰者是一种更轻便灵活的做法。

简单说：可以动态的给某个对象添加额外的职责，而不会影响从这个类中派生的其它对象。

``` js
function isAnimal(target) {
    target.isAnimal = true
    return target
}

// 装饰器
@isAnimal
class Cat {
    // ...
}
console.log(Cat.isAnimal)    // true

作用于类属性的装饰器：

function readonly(target, name, descriptor) {
    discriptor.writable = false
    return discriptor
}

class Cat {
    @readonly
    say() {
        console.log("meow ~")
    }
}

var kitty = new Cat()
kitty.say = function() {
    console.log("woof !")
}
kitty.say()    // meow ~
```

## 大前端是什么

[大前端是什么？](http://www.imooc.com/article/283259?block_id=tuijian_wz)
