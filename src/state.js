import { observe } from './observer/index.js';
import { isFunction } from './utils';
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
    let data = vm.$options.data; //用户传递的data vm.$el vue内部对属性检测如果是以$开头 不会进行代理
    // vue2中会将data中的所有数据 进行数据劫持 Object.defineProperty

    // 这个时候 vm 和 data 没有关系，通过_data 进行关联
    data = vm._data = isFunction(data) ? data.call(vm) : data;
    for (let key in data) { // vm.name = 'xxx'相当于 vm._data.name = 'xxx';
        proxy(vm, '_data', key);
    }
    observe(data);
}
function initComputed() { }
function initWatch() { }

function proxy(vm, source, key) {
    Object.defineProperty(vm, key, {
        get() {
            return vm[source][key];
        },
        set(newValue) {
            vm[source][key] = newValue;
        }
    })
}