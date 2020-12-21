const path = require('path');

module.exports = ['source-map'].map((devTool) => ({
  entry: './demo/demo.ts',
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: ['.ts', '.js'],
  },
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'demo/dist'),
    publicPath: '/demo/dist',
  },
  devtool: devTool,
  optimization: {
    minimize: true,
  },
}));
