import { initState } from './state';
import { compileToFunction } from './compiler/index';
// 在原型上添加一个init
export function initMixin(Vue) {
    // 初始化流程
    Vue.prototype._init = function (options) {

        // 数据的劫持
        const vm = this; // vue中使用 this.$options 指代的就是用户传递的属性
        vm.$options = options;

        // 初始化状态
        initState(vm); // 这里就是数据劫持

        if (vm.$options.el) {
            // 将数据挂载到这个模板上
            vm.$mount(vm.$options.el);
        }
    }
    Vue.prototype.$mount = function (el) {
        const vm = this;
        const options = vm.$options;
        el = document.querySelector(el);

        // 把模板转化成 对应的渲染函数 -> 虚拟dom概念 vnode -> diff 算法 更新虚拟dom -> 产生真实dom 
        if (!vm.$options.render) {
            let template = options.template;
            if (!template && el) { // 用户也没有传递template 就取el的内容作为模板
                template = el.outerHTML;
                let render = compileToFunction(template);
                options.render = render;
            }
        }
        // options.render 就是渲染函数
    }
}

