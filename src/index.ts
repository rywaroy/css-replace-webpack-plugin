import { Plugin, Compiler } from 'webpack';

interface IOption {
  char: string;
  ignore?: string | string[];
}

export default class CssReplace implements Plugin {
  char: string;

  ignore: string[] = [];

  constructor(option: IOption) {
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

  apply(compiler: Compiler) {
    compiler.hooks.emit.tapAsync('CssReplace', (compilation, callback) => {
      compilation.chunks.forEach((chunk) => {
        chunk.files.forEach((filename: string) => {
          if (/\.css$/.test(filename)) {
            let source: string = compilation.assets[filename].source();

            const css: string[] = [];
            this.ignore.forEach((item) => {
              const reg = new RegExp(`\.${item}[\\s\\S]*?\{[\\s\\S]+?\}`, 'g');
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
                  } else {
                    s = source[i] + s;
                  }
                }
                css.push(s + str);
              }
            });

            source = source.replace(/\.ant-/g, `.${this.char}-`);

            const fileContent = source + css.join('');

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
}
