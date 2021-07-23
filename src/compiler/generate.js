const defaultTagRE = /\{\{((?:.|\n)+?)\}\}/g // {{}}
// 构造props
function genProps(attrs) { //{name:xxx}
    let str = '';
    for (let i = 0; i < attrs.length; i++) {
        let attr = attrs[i];

        if (attr.name === 'style') { // color:red;background;blue;
            let styleObj = {};

            attr.value.replace(/([^;:]+)\:([^;:]+)/g, function () {
                styleObj[arguments[1]] = arguments[2];
            });
            attr.value = styleObj;
        }
        str += `${attr.name}:${JSON.stringify(attr.value)},`
    }
    // a:1, b;2
    return `{${str.slice(0, -1)}}`
}

function gen(el) {
    // 如果是元素
    if (el.type == 1) { // element = 1 text = 3
        return generate(el);
    } else {
        // 否则则是文本
        let text = el.text;
        if (!defaultTagRE.test(text)) {
            return `_v('${text}')`;
        } else {
            // 拆分 hello {{name}} world
            let tokens = [];
            let match;
            let lastIndex = 0;
            while (match = defaultTagRE.exec(text)) { // 看有没有匹配到
                let index = match.index; // 开始索引 
                if (index > lastIndex) {
                    tokens.push(JSON.stringify(test.slice(lastIndex, index)));
                }
                tokens.push(match[1].trim());
                lastIndex = index + match[0].length;
            }
            if (lastIndex < text.length) {
                tokens.push(text.slice(lastIndex));
            }
            return `_v(${tokens.join('+')})`;
        }
        // return `_v('${text}')`;
    }
}

// 构造子数组
function genChildren(el) {
    let children = el.children; // 获取儿子
    if (children) {
        return children.map(c => gen(c)).join(',');
    }
}

// html字符串 => 字符串 _c('div',{id:'app',a:1},'hello')
export function generate(el) {

    let children = genChildren(el);
    // 遍历树 将树拼接成字符串
    let code = `_c('${el.tag}',${el.attrs.length ? genProps(el.attrs) : 'undefined'
        })${children ? `,${children}` : ''
        }`;
    return code;
}