import webpack from 'webpack';
import path from 'path';
import fs from 'fs-extra';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import CssReplaceWebpackPlugin from '../src/index';

afterAll(() => {
  fs.removeSync(path.resolve(__dirname, './example/dist'));
});

describe('测试', () => {
  it('测试', (done) => {
    webpack({
      entry: {
        index: path.resolve(__dirname, './example/index.js'),
      },
      output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, './example/dist'),
      },
      module: {
        rules: [
          { test: /\.css$/, use: [MiniCssExtractPlugin.loader, 'css-loader'] },
        ],
      },
      plugins: [
        new MiniCssExtractPlugin(),
        new CssReplaceWebpackPlugin({ char: 'lyt', ignore: ['ant-message', 'ant-modal'] }),
      ],
    }, () => {
      const context = fs.readFileSync(path.resolve(__dirname, './example/dist/index.css'), 'utf-8');
      expect(context).toContain('.lyt-message');
      expect(context).toContain('.lyt-modal');
      expect(context).toContain('.ant-message .ant-message-title');
      expect(context).toContain('.lyt-message .lyt-message-title');
      expect(context).toContain('.warp .ant-message');
      expect(context).toContain('.warp .lyt-message');
      expect(context).toContain('.wrap .wrap2 .wrap3 .lyt-modal');
      expect(context).toContain('.wrap .wrap2 .wrap3 .ant-modal');
      done();
    });
  });
});
