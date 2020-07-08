"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class CssReplace {
    constructor(option) {
        this.ignore = [];
        this.mediaCss = [];
        this.prefix = option.prefix;
        if (option.ignore) {
            if (typeof option.ignore === 'string') {
                this.ignore = [option.ignore];
            }
            if (Array.isArray(option.ignore)) {
                this.ignore = option.ignore;
            }
        }
    }
    apply(compiler) {
        compiler.hooks.emit.tapAsync('CssReplace', (compilation, callback) => {
            compilation.chunks.forEach((chunk) => {
                chunk.files.forEach((filename) => {
                    if (/\.css$/.test(filename)) {
                        let source = compilation.assets[filename].source();
                        // 查找需要忽略的样式名
                        let css = [];
                        source = this.filterMediaCss(source);
                        this.ignore.forEach((item) => {
                            css = css.concat(this.getIgnoreCss(source, item));
                            this.copyMediaCss(item);
                        });
                        // 把ant替换掉
                        source = source.replace(/\.ant-/g, `.${this.prefix}-`);
                        const fileContent = source + css.join('') + this.getMediaCss();
                        compilation.assets[filename] = {
                            // 返回文件内容
                            source: () => fileContent,
                            // 返回文件大小
                            size: () => Buffer.byteLength(fileContent, 'utf8'),
                        };
                    }
                });
            });
            callback();
        });
    }
    /**
     * 过滤出媒体查询样式，单独处理
     */
    filterMediaCss(source) {
        const reg = new RegExp('(\@media.*?){', 'g');
        const sign = [];
        while (true) {
            const res = reg.exec(source);
            if (!res) {
                break;
            }
            let s = '';
            let index = res[0].length + res.index;
            const stack = ['{'];
            while (stack.length > 0) {
                if (source[index] === '{') {
                    stack.push(source[index]);
                }
                else if (source[index] === '}') {
                    stack.pop();
                }
                if (stack.length > 0) {
                    s += source[index];
                }
                index++;
            }
            if (new RegExp(`\.lyt-(${this.ignore.join('|')})`).test(s)) {
                const mc = {
                    name: '',
                    content: '',
                    css: [],
                };
                mc.name = res[1];
                mc.content = s;
                this.mediaCss.push(mc);
                sign.push([res.index, index]);
            }
        }
        for (let i = sign.length - 1; i >= 0; i--) {
            source = source.substring(0, sign[i][0]) + source.substring(sign[i][1], source.length + 1);
        }
        return source;
    }
    /**
     * 复制@media 样式
     */
    copyMediaCss(ignore) {
        this.mediaCss.forEach((item) => {
            const css = this.getIgnoreCss(item.content, ignore);
            item.content = item.content.replace(/\.ant-/g, `.${this.prefix}-`);
            item.css = item.css.concat(css);
        });
    }
    /**
     * 获取@media 样式
     */
    getMediaCss() {
        let s = '';
        this.mediaCss.forEach((item) => {
            s += `${item.name}{${item.content} ${item.css.join(' ')}}`;
        });
        return s;
    }
    /**
     * 获取忽略的样式
     */
    getIgnoreCss(source, ignore) {
        const prefix = `${this.prefix}-${ignore}`;
        const antPrefix = `ant-${ignore}`;
        const reg = new RegExp(`\.(${prefix}|${antPrefix})[\\s\\S]*?\{[\\s\\S]+?\}`, 'g');
        const css = [];
        while (true) {
            const res = reg.exec(source);
            if (!res) {
                break;
            }
            const str = res[0];
            const { index } = res;
            let s = '';
            for (let i = index - 1; i > -1; i--) {
                if (source[i] === '}' || source[i] === '{') {
                    break;
                }
                else {
                    s = source[i] + s;
                }
            }
            css.push((s + str).replace(new RegExp(this.prefix, 'g'), 'ant'));
        }
        return css;
    }
}
exports.default = CssReplace;
