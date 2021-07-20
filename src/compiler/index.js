
const ncname = `[a-zA-Z_][\\-\\.0-9_a-zA-Z]*`;
const qnameCapture = `((?:${ncname}\\:)?${ncname})`;

const startTagOpen = new RegExp(`^<${qnameCapture}`); // 标签开头的正则 捕获的内容是 标签名
const endTag = new RegExp(`^<\\/${qnameCapture}[^>]*>`); // 匹配标签结尾的  </div>
const attribute = /^\s*([^\s"'<>\/=]+)(?:\s*(=)\s*(?:"([^"]*)"+|'([^']*)'+| ([^\s"'=<>`]+)))?/; // 匹配属性的 
const startTagClose = /^\s*(\/?)>/; // 匹配标签结束的  >
const defaultTagRE = /\{\{((?:.|\n)+?)\}\}/g // {{}}

// 工厂函数 资料转对象
function createAstElement(tagName, attrs) {
    return {
        tag: tagName, // 标签名
        type: 1,
        children: [],
        parent: null,
        attrs
    }
}


// html字符串解释成dom树 将解析后的结果 组装成一个树结构 栈结构
// 通过栈算法，把栈顶相同则弹出，不同则叠加的原则做处理
let root = null;
let stack = [];
function start(tagName, attributes) {
    let parent = stack[stack.length - 1];
    let element = createAstElement(tagName, attributes);
    if (!root) {
        root = element;
    }
    
    element.parent = parent; // 当放入栈中时 记录父亲是谁
    if (parent) {
        parent.children.push(element);
    }
    stack.push(element);
}

function end(tagName) {
    let last = stack.pop();
    if (last.tag !== tagName) {
        throw new Error('标签有误')
    }
}

function chars(text) {
    console.log('text', text);
    text = text.replace(/\s/g, ""); // 删除空格
    let parent = stack[stack.length - 1];
    if (text) {
        parent.children.push({
            type: 3,
            text
        })
    }
}

// 这里相当于编译器  
function parserHTML(html) { // <div id="app">123123</div>
    // 前进 把前几位清空
    function advance(len) {
        html = html.substring(len);
    }
    // 匹配开始的标签 <div>123</div> 中的 <div>,然后转化成对象
    function parseStartTag() {
        // 匹配出前面的标签属性
        const start = html.match(startTagOpen);
        if (start) {
            const match = {
                tagName: start[1],
                attrs: []
            }
            // 匹配后前进
            advance(start[0].length);
            let end;
            let attr;
            // 如果没有遇到标签结尾就不停地解析
            while (!(end = html.match(startTagClose)) && (attr = html.match(attribute))) {
                match.attrs.push({
                    name: attr[1],
                    value: attr[3] || attr[4] || attr[5]
                })
                advance(attr[0].length);
            }
            if (end) {
                advance(end[0].length)
            }
            return match;
        }
        return false; //不是开始标签
    }

    while (html) { // 看要解析的内容是否存在。如果存在就不停地解析
        let textEnd = html.indexOf('<'); // 当前解析的开头 <div>hello world</div>
        if (textEnd === 0) {
            const startTagMatch = parseStartTag(); // 解析开始标签
            // 处理开始标签
            if (startTagMatch) {
                start(startTagMatch.tagName, startTagMatch.attrs)
                continue;
            }
            // 处理结束标签
            const endTagMatch = html.match(endTag);
            if (endTagMatch) {
                end(endTagMatch[1]);
                advance(endTagMatch[0].length);
                continue;
            }

            break;

            // const endTagMatch = parseEndTag();

            // if (endTagMatch) {

            // }
        }
        // 文本内容
        let text; // 123123</div>
        if (textEnd > 0) {
            text = html.substring(0, textEnd)
        }

        if (text) {
            chars(text)
            advance(text.length);
        }
    }
}

export function compileToFunction(template) {

    parserHTML(template);
    console.log(root);
}