# ES6

## let和var的区别

- `let`定义块级作用域变量

- `let`没有变量作用域提升

- let变量不能重复声明

- 暂时性死区

  只要块级作用域内存在 `let` 命令，只有`let`声明语句执行完之后，变量才能使用，不然会报`Uncaught ReferenceError`错误

  暂时性死区的本质：只要一进入当前作用域，所要使用的变量就已经存在了，但是不可获取，只有等到声明变量的那一行代码出现，才可以获取和使用该变量。

  ``` js
    typeof x // ReferenceError
    let x

    typeof undeclared_variable // undefined
  ```

## const 的本质

`const`实际上保证的，并不是变量的值不得改动，而是变量指向的**内存地址**不得改动。对于简单类型的数据（数值、字符串、布尔值），值就保存在变量指向的那个内存地址，因此等同于常量。但对于复合类型的数据（主要是对象和数组），变量指向的内存地址，保存的只是一个指针，*const只能保证这个指针是固定的，至于它指向的数据结构是不是可变的，就完全不能控制了*。因此可以修改复合数据类型的的属性。

``` js
const foo = {};

foo.prop = 123 // 为 foo 添加一个属性，可以成功
foo.prop // 123

// 将 foo 指向另一个对象，就会报错
foo = {}; // TypeError: "foo" is read-only
```

## 箭头函数与正常函数的区别

- 箭头函数不绑定`arguments`，取而代之用rest参数`...`解决

- 箭头函数不绑定this，会捕获其所在的上下文的`this`值，作为自己的`this`值,普通函数的`this`指向调用它的那个对象

- 箭头函数没有原型prototype属性

- 箭头函数是匿名函数，不能作为构造函数，不能使用`new`。 因为 `new` 命令在执行时需要将构造函数的 `prototype` 赋值给新的对象的 __proto__

- 箭头函数不能当做`Generator`函数,不能使用`yield`关键字

- 箭头函数通过 `call()` 或 `apply()` 方法调用一个函数时，只传入了一个参数，对 `this` 并没有影响。

``` js
var obj = {
  a:10,
  b: ()=>{
    console.log(this.a);  //undefined
    console.log(this);    //window
  },
  c: function(){
    console.log(this.a); //10
  }
}
obj.b()
obj.c()
```

## js原型继承和class继承

- js原型继承

``` js
function Animal(name) {
    this.name = name
}

Animal.prototype.hello = function () {
    console.log('Hello, ' + this.name + '!')
}

function Dog(name, age) {
    // 调用父类构造函数，绑定this变量
    Animal.call(this, name)
    this.age = age
}

// 定义一个中间对象, 构造器指向子类
function __() { this.constructor = Dog }

// 把中间对象的原型指向父类的原型Animal.prototype
__.prototype = Animal.prototype

// 把Dog的原型指向一个新的中间对象，中间对象的原型正好指向Animal.prototype
Dog.prototype = new __()

// 继续在子类原型(即新创建的中间对象)上定义方法
Dog.prototype.getAge = function () {
    return this.age
}

var dog = new Dog('哈士奇', 2);
dog.name // '哈士奇'
dog.age // 2

// 验证原型:
dog.__proto__ === Dog.prototype // true
dog.__proto__.__proto__ === Animal.prototype // true
dog instanceof Animal // true
dog instanceof Dog // true
```

    Js的原型继承实现方式就是：
    - 定义新的构造函数，并在内部用`call()`调用希望“继承”的构造函数，并绑定`this`
    - 借助中间函数实现原型链继承
    - 继续在新的构造函数的原型上定义新方法

- `class`实现继承

``` js
class Animal {
    hello(name) {
        console.log('Hello, ' + this.name + '!')
    }
}

class Dog extends Animal {
    constructor(name, age) {
        super(name) // 必须用super调用父类的构造方法
        this.age = age
    }
    getAge() {
        return this.age
    }
}

const dog = new Dog();
```

## commonjs模块和es6模块的区别

`es6`模块的特点：

- 静态化，必须在顶部，不能使用条件语句，自动采用严格模式
- `treeshaking`和编译优化，以及`webpack3`中的作用域提升
- 外部可以拿到实时值，而非缓存值(是引用而不是copy)

`es6`模块和`commonjs`模块的区别：

- 可以对`commonjs`模块重新赋值，对`es6`模块重新赋值会编译报错
- `commonjs`是对模块的拷贝（浅拷贝），`es6`是对模块的引用（也就是说，es6模块只能**只读**，不能改变其值，具体点就是指针指向不能变，类似const）
- `commonjs`模块是运行时加载，`es6`模块是编译时输出接口。

`es6`模块和`commonjs`模块的相同点：

- 两者都可以对模块对象内部属性的值进行改变

## WeakSet 与 Set 的区别

- WeakSet的成员只能是对象，而 Set 对象都可以
- WeakSet 对象中储存的对象值都是弱引用的，可以被垃圾回收机制回收
- WeakSet不能遍历，只有add、delete和has三个方法

> WeakSet用来做什么？储存DOM节点，这样移除DOM时就可以不用担心内存泄漏了

## ES6 Proxy介绍

`Proxy` 用于修改某些操作的默认行为，等于是在语言层面做出了修改，也就是对编程语言进行改动。具体来说，`Proxy`是一种机制，用来拦截外界对目标对象的访问，可以对这些访问进行过滤或者改写，所以`Proxy`更像是目标对象的代理器。

ES6 原生提供Proxy构造函数，用来生成Proxy实例：

``` js
let proxy = new Proxy(target, handler);
```

`target` 是要代理的目标对象;
`handler` 也是一个对象，用来定义拦截的具体行为；如果拦截具有多个操作，就可以这样定义handler {fn, ….}

`handler` 能代理的一些常用的方法有：

- get：读取
- set：修改
- has：判断对象是否有该属性
- construct：构造函数
- defineProperty：拦截 `Object.defineProperty(proxy, propKey, propDesc)`、`Object.defineProperties(proxy, propDescs)`，返回一个布尔值
- ownKeys，apply，deleteProperty 等等...

> 用了 Proxy 之后，Proxy代理的 this 并非指向目标对象，而是指向自身Proxy
