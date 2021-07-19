let oldArrayPrototype = Array.prototype;
export let arrayMethods = Object.create(Array.prototype);
// arrayMethods.__proto__ = Array.prototpe; 继承

let methods = [
    'push',
    'shift',
    'unshift',
    'pop',
    'reverse',
    'sort',
    'splice'
]
methods.forEach(method => {
    // 用户调用的如果是以上七个方法 会用我自己重写的，否则用原来的数组方法
    arrayMethods[method] = function (...args) {
        oldArrayPrototype[method].call(this, ...args);
        let inserted;
        let ob = this.__ob__; // 根据当前数组获取到observer实例 所有被劫持过的对象 都有__ob__
        // arr.push({a:1});
        switch(method){
            case 'push':
            case 'unshift':
                args; // 就是新增的内容
                break;
            case 'splice':
                args.slice(2); // 取出第三个往后 就是要新增的内容
                break;
            default:
                break;
        }
        // 如果有新增的内容要进行继续劫持,需要观察每一项而不是整个数组
        if(inserted) ob.observeArray(inserted);
    }
})