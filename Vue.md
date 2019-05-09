# Vue

## 使用jQuery和使用MVVM框架的区别

- 数据和视图的分离，解耦（开放封闭原则）
- 数据驱动视图，只关心数据变化，DOM操作被封装

## 对MVVM的理解

- `Model`(模型、数据) - javascript
- `View`(视图) - DOM
- `ViewModel`(视图模型) - DOM Listeners & data Bindings

## Vue响应式原理

- 关键方法`Object.defineProperty`
- `vue`将`data`初始化为一个`Observer`并对对象中的每个值，重写了其中的`get`、`set`方法，`data`中的每个`key`，都有一个独立的依赖收集器
- 在`get`中，向依赖收集器添加了监听
- 在`mount`时，实例了一个`Watcher`，将收集器的目标指向了当前`Watcher`
- 在`data`值发生变更时，触发`set`，触发了依赖收集器中的所有监听的更新，来触发`Watcher.update`

## Vue如何解析模板

模板的本质是字符串，有逻辑，可嵌入js变量

- 模板转换为js代码
- 模板最终走`render`函数
- `render`函数执行是返回`vnode`
- `updateComponent`

## Vue实现流程

1. 解析模板成`render`函数
2. 响应式开始监听
3. 首次渲染，显示页面，且绑定依赖
4. `data`属性变化，触发`rerender`

## `Vue` 的生命周期和钩子函数

Vue实例有一个完整的生命周期，也就是从**开始创建、初始化数据、编译模板、挂载Dom、渲染→更新→渲染、销毁**等一系列过程，我们称这是Vue的生命周期。通俗说就是Vue实例从创建到销毁的过程，就是生命周期。

1. 实例、组件通过`new Vue()` 创建出来之后会初始化事件和生命周期(`init()`)，然后就会执行`beforeCreate`钩子函数，这个时候，数据还没有挂载，只是一个空壳，无法访问到数据和真实的`dom`，一般不做操作

2. 挂载数据，绑定事件等等，然后执行`created`函数，这个时候已经可以使用到数据，也可以更改数据,在这里更改数据不会触发`updated`函数，在这里可以在渲染前倒数第二次更改数据的机会，不会触发其他的钩子函数，一般可以在这里做初始数据的获取

3. 接下来开始找实例是否含有`el`选项，如果没有的话，就会调用`vm.$mount(el)`这个方法，紧接着会查找组件对应的模板（`template`），编译模板为虚拟`dom`放入到`render`函数中准备渲染，然后执行`beforeMount`钩子函数，在这个函数中虚拟`dom`已经创建完成，马上就要渲染,在这里也可以更改数据，不会触发`updated`，在这里可以在渲染前最后一次更改数据的机会，不会触发其他的钩子函数，一般可以在这里做初始数据的获取

4. 接下来开始`render`，渲染出真实`dom`，然后执行`mounted`钩子函数，此时，组件已经出现在页面中，数据、真实`dom`都已经处理好了,事件都已经挂载好了，可以在这里操作真实`dom`等事情

5. 当组件或实例的数据更改之后，会立即执行`beforeUpdate`，然后`vue`的虚拟`dom`机制会重新构建虚拟`dom`与上一次的虚拟`dom`树利用`diff`算法进行对比之后重新渲染，一般不做什么事儿

6. 当更新完成后，执行`updated`，数据已经更改完成，`dom`也重新`render`完成，可以操作更新后的虚拟`dom`

7. 当经过某种途径调用`$destroy`方法后，立即执行`beforeDestroy`，一般在这里做一些善后工作，例如清除计时器、清除非指令绑定的事件等等

8. 组件的数据绑定、监听...去掉后只剩下`dom`空壳，这个时候，执行`destroyed`，在这里做善后工作也可以

附Vue官网的图：

![Vue生命周期](https://cn.vuejs.org/images/lifecycle.png)

## Vue 中父子组件通讯的方式

1. 通过`props`传递

   这种是最常见也是最通用的做法，优点是简单，数据流单向、清晰；但是如果遇到深层次传递会造成维护上的困难

2. `$parent` / `$children`
  
   这种方法其实并不属于数据的传递而是一种主动的查找，而且耦合的比上一种方法还要厉害，因为这个`$parent`只能取到当前父组件的数据，一旦这个组件放在别的页面用，就可能会出现取不到数据等问题，所以Vue不推荐使用

3. `$emit` / `$on`

   这种方法是最常用的子传父的方法

4. `.sync` 修饰符

   是一种类似`$on`的语法糖，它被扩展为一个自动更新父组件属性的 `v-on` 监听器。需要当子组件数据变更后把变更后的数据回传 `this.$emit('update:myPropName', newData)`，其中 `myPropName` 表示要更新的 `prop` 值

5. `$refs`
  
   这个方法一般是用来调用子组件中的方法，很少用来取数据

6. `provide` / `inject` 依赖注入

   `provide` 和 `inject`（依赖注入） 主要为高阶插件/组件库提供用例。并不推荐直接用于应用程序代码中。并且这对选项需要一起使用，以允许一个祖先组件向其所有子孙后代注入一个依赖，不论组件层次有多深，并在起上下游关系成立的时间里始终生效。

   通过`provide`传递的参数是非响应式的，但是如果你传的的是一个可监听的对象，那么其对象的属性还是可响应的。

## Vue 中兄弟组件通讯的方式

1. `EventBus`

   思路就是声明一个全局`Vue`实例变量 `EventBus` , 把所有的通信数据，事件监听都存储到这个变量上，这样就达到在组件间数据共享了，有点类似于 `Vuex`,但这种方式只适用于极小的项目，复杂项目还是推荐 `Vuex`。

   ``` javascript
    // 声明一个EventBus全局变量
    let EventBus = new Vue()

    // 组件1
    let Com1 = Vue.extend({
        created () {
            EventBus.$emit('received', 'from component1')
        }
    })

    // 组件2
    let Com2 = Vue.extend({
        mounted () {
            // from component1
            EventBus.$on('received', (data) => { console.log(data) })
        }
    })
   ```

2. `Vuex`

   官方推荐，`Vuex` 是一个专为 `Vue.js` 应用程序开发的状态管理模式

## Vue v-model语法糖解析

``` html
<input v-model="val" />

相当于

<input v-bind:value="val" v-on:input="val = $event.target.value" />
```

## Vuex的主要功能

- `state`：页面状态管理容器对象。集中存储`Vue components`中`data`对象的零散数据，全局唯一，以进行统一的状态管理。页面显示所需的数据从该对象中进行读取，利用Vue的细粒度数据响应机制来进行高效的状态更新。

- `getters`：`state`对象读取方法

- `mutations`：状态改变操作方法。是`Vuex`修改`state`的唯一推荐方法，其他修改方式在严格模式下将会报错。该方法只能进行同步操作，且方法名只能全局唯一。操作之中会有一些hook暴露出来，以进行state的监控等。

- `actions`：操作行为处理模块。负责处理`Vue Components`接收到的所有交互行为。包含同步/异步操作，支持多个同名方法，按照注册的顺序依次触发。向后台API请求的操作就在这个模块中进行，包括触发其他`action`以及提交`mutation`的操作。该模块提供了`Promise`的封装，以支持`action`的链式触发。

- `commit`：状态改变提交操作方法。对`mutation`进行提交，是唯一能执行`mutation`的方法。

- `dispatch`：操作行为触发方法，是唯一能执行`action`的方法。

## Vuex的原理及理解

`vuex`中的`store`本质就是没有`template`的隐藏着的`vue`组件

我们传入的`state`会作为一个隐藏的`vue`组件的`data`,也就是说，执行commit操作，本质上其实是修改这个组件的`data`值

## Vuex如何区分state是外部直接修改，还是通过mutation方法修改的

Vuex中修改state的唯一渠道就是执行 `commit('xx', payload)` 方法，其底层通过执行 `this._withCommit(fn)` 设置`_committing`标志变量为`true`，然后才能修改state，修改完毕还需要还原`_committing`变量。外部修改虽然能够直接修改state，但是并没有修改`_committing`标志位，所以只要watch一下state，state `change`时判断是否`_committing`值为`true`，即可判断修改的合法性。

## Vue中data, prop, computed的初始化顺序

`prop`先于`data`先于`computed`, 加载的时间都在`beforeCreate` 和 `created`之间

## Vue中使用computed和methods的区别

- `computed`是属性调用，而`methods`是函数调用, 使用methods定义的方法必须要加上()来调用

    ``` html
    <h1>{{ computedTest }}</h1>
    <h1>{{ methodTest() }}</h1>
    ```

- `computed`具有缓存功能， `computed`依赖于`data`中的数据，只有在它的相关依赖数据发生改变时才会重新求值, `methods`在重新渲染的时候，函数总会重新调用执行。所以使用`computed`会比`methods`方法性能更好

- `computed`必须返回一个值页面绑定的才能取得值，而`methods`中可以只执行逻辑代码，可以有返回值，也可以没有

## Vue-Router实现前端路由

### 前端路由

"更新新视图但不重新请求页面"是前端路由的原理的核心, 目前在浏览器环境中这一功能的实现主要有两种方式

- 利用URL中的hash（"#"）
- 利用History interface在 HTML5中新增的方法

## vue-router实现前端路由的方法和对比

在vue-router中有一个`mode`参数，这个参数的可选值有`hash`、 `history`、`abstract`

- `hash`模式是vue-router的默认模式，它会带个'#'看着不美观，但是不存在兼容性问题
- `history`模式会将URL修改的和正常请求后端的URL一样，但是由于底层的实现调用HTML5的`history.pushState()`，所以存在浏览器兼容性问题
- 使用`history`模式存在一个问题：在访问二级页面的时候，做刷新操作，会出现404错误，这时就需要和后端人员配合让他配置一下`apache`或是`nginx`的url重定向，重定向到index.html页面

## Vue中的 $router 和 $route 的区别

- `$router`为`VueRouter`的实例，相当于一个全局的路由器对象，里面含有很多属性和子对象; 如果要导航到不同URL，可以使用`$router.push`方法
- `$route`相当于当前正在跳转的路由对象, 可以从里面获取`name, path, params, query`