// Vue 核心代码 只是Vue的一个声明
import {initMixin} from './init';
function Vue(options) {
    this._init(options);
}
// 通过引入文件的方法 给Vue原型上添加方法
initMixin(Vue);



export default Vue;