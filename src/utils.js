
/**
 * 函数节流，避免频繁调用，让函数方法有规律的调用，提高浏览器效率
 * 多用于onScroll或者resize事件
 *
 * @param {*} func 执行方法
 * @param {*} delay 执行频率的时间
 * @returns
 */
const throttle = (func, delay) => {
  let last = new Date();

  return function () {
    let now = new Date();
    if (now - last >= delay) {
      func.apply(this, Array.prototype.slice.call(arguments))
      last = now;
    }
  }
}

/**
 * 函数防抖，使操作方法在事件结束一段时间后执行re
 * 多用于输入框(例：在用户停止输入的500ms后再处理用户数据)
 *
 * @param {*} func 执行方法
 * @param {*} delay 执行频率的时间
 * @returns
 */
const debounce = (func, delay) => {
  let timer = null
  return function () {
    if (timer) clearTimeout(timer)
    timer = setTimeout(() => {
      func.apply(this, Array.prototype.slice.call(arguments))
      clearTimeout(timer)
    }, delay)
  }
}

// 快速排序
const quickSort = (arr) => {
  if (arr.length <= 1) return arr
  let middleIdx = Math.floor(arr.length / 2);
  const middle = arr[middleIdx]
  let left = []
  let right = []
  for (let i = 0; i < arr.length; i++) {
    if (arr[i] === middle) continue
    arr[i] < middle ? left.push(arr[i]) : right.push(arr[i])
  }
  return quickSort(left).concat(middle, quickSort(right))
}

// new 方法
let rewriteNew = (func) => {
  let obj = Object.create(func.prototype)
  const result = func.apply(obj, Array.prototype.slice.call(arguments, 1))
  return result instanceof Object ? result : obj
}

/**
 * 柯里化函数实现
 * 用于延迟执行（等参数齐全之后执行）、参数复用
 *
 * @param {*} func 执行函数
 * @returns
 */
const currying = function (func) {
  let args = Array.prototype.slice.call(arguments, 1)
  args = args || [];
  let len = func.length;
  let self = this;
  return function () {
    let _args = Array.prototype.slice.call(arguments)
    Array.prototype.push.apply(args, _args);

    // 如果参数个数小于最初的fn.length，则递归调用，继续收集参数
    if (_args.length < len) {
      return currying.call(self, func, _args)
    }
    // 参数收集完毕，则执行fn
    return func.apply(this, _args)
  }
}
/**
 * 实现一个add方法，使计算结果能够满足如下预期：
 * 
 * add(1)(2)(3) = 6;
 * add(1, 2, 3)(4) = 10;
 * add(1)(2)(3)(4)(5) = 15;
 * @returns
 */
function add() {
  let args = Array.prototype.slice.call(arguments)
  let sum = 0;

  let tempFunc = function (...rest) {
    Array.prototype.push.apply(args, rest)
    return tempFunc
  }

  tempFunc.toString = function () {
    return args.reduce(function (prev, next) { return prev + next }, sum)
  }

  return tempFunc
}

// 用 Promise 封装 ajax
class BaseAjax {
  request(method = 'get', url, options = null) {
    return new Promise((resolve, reject) => {
      var xhr = new XMLHttpRequest();
      xhr.open(method, url);
      xhr.send(options);
      if (method === 'post') {
        xhr.setRequestHeader('ContentType', 'application/json');
      }
      xhr.onreadystatechange(() => {
        if (xhr.status === 200 && xhr.readyState === 4) {
          resolve(xhr.responseText)
        } else {
          reject(xhr.responseText)
        }
      })
    })
  }

  get(url, options) {
    if (typeof options === 'object') {
      url += '?'
      Object.keys(options).forEach(key => {
        url += `${key}=${options[key]}`
      })
    }
    return this.request('get', url)
  }

  post(url, data) {
    return this.request('post', url, data);
  }
}


// var tree = {
//   value: "-",
//   left: {
//       value: '+',
//       left: {
//           value: 'a',
//       },
//       right: {
//           value: '*',
//           left: {
//               value: 'b',
//           },
//           right: {
//               value: 'c',
//           }
//       }
//   },
//   right: {
//       value: '/',
//       left: {
//           value: 'd',
//       },
//       right: {
//           value: 'e',
//       }
//   }
// }
// 二叉树深度优先遍历 - 递归版
function dfs_1(node) {
  let result = []

  let handler = (node) => {
    if (node) {
      result.push(node.value)
      handler(node.left)
      handler(node.right)
    }
  }
  handler(node)

  return result
}

// 二叉树深度优先遍历 - 非递归版
function dfs_2(node) {
  let result = []
  let stack = [node]

  while (stack.length) {
    let item = stack.pop();
    result.push(item.value)
    item.right && stack.push(item.right)
    item.left && stack.push(item.left)
  }

  return result
}

// 二叉树广度优先遍历 递归
function bfs_1(tree) {
  let result = []
  let stack = [tree]
  let count = 0

  let hadnler = (tree) => {
    let node = stack[count]
    if (node) {
      result.push(node.value)
      if (node.left) stack.push(node.left);
      if (node.right) stack.push(node.right);
      count++;
      hadnler();
    }
  }

  handler(tree)
  return result
}

// 二叉树广度优先遍历 非递归
function bfs_2(node) {
  let result = [];
  let queue = [];
  queue.push(node);
  let pointer = 0;
  while (pointer < queue.length) {
    let node = queue[pointer++];
    result.push(node.value);
    node.left && queue.push(node.left);
    node.right && queue.push(node.right);
  }
  return result;
}
