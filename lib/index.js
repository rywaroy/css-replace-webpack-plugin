var CssReplace = /** @class */ (function () {
    function CssReplace(option) {
        this.ignore = [];
        this.char = option.char;
        if (option.ignore) {
            if (typeof option.ignore === 'string') {
                this.ignore = [option.ignore];
            }
            if (Array.isArray(option.ignore)) {
                this.ignore = option.ignore;
            }
        }
    }
    CssReplace.prototype.apply = function (compiler) {
        var _this = this;
        compiler.hooks.emit.tapAsync('CssReplace', function (compilation, callback) {
            compilation.chunks.forEach(function (chunk) {
                chunk.files.forEach(function (filename) {
                    if (/\.css$/.test(filename)) {
                        var source_1 = compilation.assets[filename].source();
                        var css_1 = [];
                        _this.ignore.forEach(function (item) {
                            var reg = new RegExp("." + item + "[\\s\\S]*?{[\\s\\S]+?}", 'g');
                            while (true) {
                                var res = reg.exec(source_1);
                                if (!res) {
                                    break;
                                }
                                var str = res[0];
                                var index = res.index;
                                var s = '';
                                for (var i = index - 1; i > -1; i--) {
                                    if (source_1[i] === '}' || source_1[i] === '{') {
                                        break;
                                    }
                                    else {
                                        s = source_1[i] + s;
                                    }
                                }
                                css_1.push(s + str);
                            }
                        });
                        source_1 = source_1.replace(/\.ant-/g, "." + _this.char + "-");
                        var fileContent_1 = source_1 + css_1.join('');
                        compilation.assets[filename] = {
                            // 返回文件内容
                            source: function () { return fileContent_1; },
                            // 返回文件大小
                            size: function () { return Buffer.byteLength(fileContent_1, 'utf8'); },
                        };
                    }
                });
            });
            callback();
        });
    };
    return CssReplace;
}());
export default CssReplace;
