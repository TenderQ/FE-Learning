(function (window) {
    const PENDING = 0
    const FULFILLED = 1
    const REJECTED = 2

    function Promise(fn) {
        let state = PENDING  // 执行状态
        let value = null     // 返回结果
        let handlers = []    // 存放成功回调的数组

        function fulfill(result) {
            state = FULFILLED
            value = result
            handlers.forEach(handle)
            handlers = null
        }
        function reject(error) {
            state = REJECTED
            value = error
            handlers = null
        }
        function resolve(result) {
            try {
                let then = getThen(result)
                if (then) {
                    doResolve(then.bind(result), resolve, reject)
                    return
                }
                fulfill(result)
            } catch (error) {
                reject(error)
            }
        }

        function handle(handler) {
            if (state === PENDING) {
                handlers.push(handler)
            } else {
                if (state === FULFILLED && typeof handler.onFulfilled === 'function') {
                    handler.onFulfilled(value)
                }
                if (state === REJECTED && typeof handler.onRejected === 'function') {
                    handler.onRejected(value);
                }
            }
        }

        this.done = function (onFulfilled, onRejected) {
            setTimeout(function() {
                handle({
                    onFulfilled: onFulfilled,
                    onRejected: onRejected
                })
            })
        }

        doResolve(fn, resolve, reject)
    }
    Promise.prototype.then = function(onFulfilled, onRejected) {
        var self = this
        return new Promise(function(resolve, reject) {
            return self.done(function(result) {
                if (typeof onFulfilled === 'function') {
                    try {
                        return resolve(onFulfilled(result))
                    } catch (error) {
                        return reject(error)
                    }
                } else {
                    return resolve(result)
                }
            }, function(error) {
                if (typeof onRejected === 'function') {
					try {
						return resolve(onRejected(error))
					} catch(err) {
						return reject(err)
					}
				} else {
					return reject(error)
				}
            })
        })
    }

    function getThen(value) {
        var t = typeof value
        if (value && (t === 'object' || t === 'function')) {
            var then = value.then
            if (typeof then === 'function') {
                return then
            }
        }
        return null
    }

    function doResolve(fn, onFulfilled, onRejected) {
        var done = false
        try {
            fn(function(value) {
                if (done) return
                done = true
                onFulfilled(value)
            }, function(reason) {
                if (done) return
                done = true
                onRejected(reason)
            });
        } catch(ex) {
            if (done) return
            done = true
            onRejected(ex)
        }
    }
    window.Promise = Promise
})(window)
