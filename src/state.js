
export function initState(vm) {
    const opts = vm.$options;
    // vue的数据来源 属性 方法 数据 计算属性 watch
    if (opts.props) {
        initProps(vm);
    }
    if (opts.methods) {
        initMethod(vm);
    }
    if (opts.data) {
        initData(vm);
    }
    if (opts.computed) {
        initComputed(vm);
    }
    if (opts.watch) {
        initWatch(vm);
    }
}

function initProps() { }
function initMethod() { }
function initData(vm) {
    console.log(vm.$options.data);
    let data = vm.$options.data; //用户传递的data
    // 判断是否函数
    data = vm._data = typeof data === 'function' ? data.call(vm) : data;
    // 对象劫持 用户改变了数据 我希望可以得到通知 => 刷新页面
    // mvvm 
}
function initComputed() { }
function initWatch() { }