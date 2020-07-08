import { Plugin, Compiler } from 'webpack';
interface IOption {
    prefix: string;
    ignore?: string | string[];
}
interface IMediaCss {
    name: string;
    content: string;
    css: string[];
}
export default class CssReplace implements Plugin {
    prefix: string;
    ignore: string[];
    mediaCss: IMediaCss[];
    constructor(option: IOption);
    apply(compiler: Compiler): void;
    /**
     * 过滤出媒体查询样式，单独处理
     */
    filterMediaCss(source: string): string;
    /**
     * 复制@media 样式
     */
    copyMediaCss(ignore: string): void;
    /**
     * 获取@media 样式
     */
    getMediaCss(): string;
    /**
     * 获取忽略的样式
     */
    getIgnoreCss(source: string, ignore: string): string[];
}
export {};
