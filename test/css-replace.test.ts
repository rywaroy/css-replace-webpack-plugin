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
        new CssReplaceWebpackPlugin({ prefix: 'lyt', ignore: ['message'] }),
      ],
    }, () => {
      const context = fs.readFileSync(path.resolve(__dirname, './example/dist/index.css'), 'utf-8');
      expect(context).toContain('.ant-message');
      expect(context).toContain('.ant-message .ant-message-title');
      expect(context).toContain('.warp .ant-message');
      expect(context).toContain('.warp2 .lyt-message');
      expect(context).toContain('.ant-message-media-title');
      expect(context).toContain('.wrap .lyt-message-media');
      expect(context).toContain('.wrap2 .ant-message-media');
      done();
    });
  });
});
