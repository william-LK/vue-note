export function isFunction(val) {
    return Object.prototype.toString.call(val) === '[object Function]';
}

export function isObject(val) {
    return typeof val === 'object' && val !== null;
}