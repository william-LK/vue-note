import { isObject } from '../utils';
import { arrayMethods } from './array';

// 1. 如果数据是对象 会将对象不停的递归 进行劫持
// 2. 如果是数组，会劫持数组的方法，并对数组中不是基本数据类型的进行检测


// 监测数据变化 类有类型  对象无类型
class Observer {
    constructor(data) { // 对对象中的所有属性进行劫持

        data.__ob__ = this;
        // 在循环时不被循环，enumerable 不可枚举
        Object.defineProperty(data,'__ob__',{
            value: this,
            enumerable: false
        })
        if (Array.isArray(data)) {
            // 数组劫持的逻辑
            // 数组原来的方法进行改写， 切片编程 高阶函数
            // 重写了会影响原数组的原生方法
            data.__proto__ = arrayMethods;
            // 如果数组中的数据是对象类型，需要监控对象的变化  为了处理 索引取值问题
            this.observeArray(data);
        } else {
            // 普通对象处理
            this.walk(data); //对象劫持的逻辑
        }
    }
    observeArray(data) { // 对数组中的数组 和 数组中的对象再次劫持 递归了
        data.forEach(item => observe(item));
    }
    walk(data) { // 对象
        // Object.keys 只遍历当前对象 不遍历原型链 for in会那原型链上的
        Object.keys(data).forEach(key => {
            defineReactive(data, key, data[key]);
        })
    }
}

// vue2 会对对象进行遍历 将每个属性 用defineProperty 重新定义 性能差
function defineReactive(data, key, value) {
    observe(value); // 本身用户默认值是对象套对象，需要递归处理（性能差，尽可能扁平化）
    // 新增一个值，会无法监听，因为这里是根据初始化的键作为监听依据
    Object.defineProperty(data, key, {
        get() {
            return value;
        },
        set(newV) { // hack
            observe(newV); // 如果用户赋值一个新对象，需要将这个对象进行劫持
            value = newV
        }
    })
}


export function observe(data) {
    // 如果是对象才观察
    if (!isObject(data)) {
        return;
    }

    if(data.__ob__){
        return;
    }

    return new Observer(data);
}