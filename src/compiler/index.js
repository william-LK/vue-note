const ncname = `[a-zA-Z_][\\-\\.0-9_a-zA_Z]*`; // 标签名 开头必须是字母
const qnameCapture = `((?:${ncname}\\:)?${ncname})`; // 用来获取标签名的  match后的索引为1的



const startTagOpen = new RegExp(`^<\\/${qnameCapture}[^>]*>`); // 匹配开始标签
const endTag = new RegExp(`^<\\/${qnameCapture}[^>]*>`); // 匹配闭合标签
const attribute = /^\s*([^\s"'<>\/=]+)(?:\s*(=)\s*(?:"([^"]*)"+|'([^']*)'+|([^\s"'=<>`]+)))?/   // 匹配属性 a=b a="b" a='b'
const startTagClose = /^\s*(\/?)>/
const defaultTagRE = /\{\{((?:.|\n)+?)\}\}/g // {{}}

// html字符串解释成dom树
function start(tagName, attributes) {

}

function end(tagName) {

}

function chars(text) {

}

function parserHTML(html) { // <div id="app">123123</div>

    function parseStartTag(html){
        html.match(startTagOpen);
    }

    while (html) { // 看要解析的内容是否存在。如果存在就不停地解析
        let textEnd = html.indexOf('<');
        if(textEnd == 0){
            const startTagMatch = parseStartTag(); // 解析开始标签

            // if(startTagMatch){

            // }
            // const endTagMatch = parseEndTag();

            // if(endTagMatch){

            // }
        }
    }
}

export function compileToFunction(template) {
    console.log(template);

    parserHTML(template);

}