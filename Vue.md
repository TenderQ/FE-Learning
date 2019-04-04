# Vue

## 使用jQuery和使用MVVM框架的区别

- 数据和视图的分离，解耦（开放封闭原则）
- 数据驱动视图，只关心数据变化，DOM操作被封装

## 对MVVM的理解

- Model(模型、数据) - javascript
- View(视图) - DOM
- ViewModel(视图模型) - DOM Listeners & data Bindings

## Vue响应式原理

- 关键方法`Object.defineProperty`
- vue将data初始化为一个Observer并对对象中的每个值，重写了其中的get、set方法，data中的每个key，都有一个独立的依赖收集器
- 在get中，向依赖收集器添加了监听
- 在mount时，实例了一个Watcher，将收集器的目标指向了当前Watcher
- 在data值发生变更时，触发set，触发了依赖收集器中的所有监听的更新，来触发Watcher.update

## Vue如何解析模板

模板的本质是字符串，有逻辑，可嵌入js变量

- 模板转换为js代码
- 模板最终走render函数
- render函数执行是返回vnode
- updateComponent

## Vue实现流程

1. 解析模板成render函数
2. 响应式开始监听
3. 首次渲染，显示页面，且绑定依赖
4. data属性变化，触发rerender
