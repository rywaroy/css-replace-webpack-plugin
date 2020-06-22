import { Plugin, Compiler } from 'webpack';
interface IOption {
    char: string;
    ignore?: string | string[];
}
export default class CssReplace implements Plugin {
    char: string;
    ignore: string[];
    constructor(option: IOption);
    apply(compiler: Compiler): void;
}
export {};
