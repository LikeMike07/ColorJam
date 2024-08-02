const prod = process.env.NODE_ENV === 'production';
const Dotenv = require('dotenv-webpack');
const path = require('path')
const ReactRefreshWebpackPlugin = require('@pmmmwh/react-refresh-webpack-plugin');

module.exports = {
  mode: prod ? 'production' : 'development',
  entry: './src/index.tsx',
  devServer: {
    static: path.join(__dirname, 'dist'),
    port: 4000,
    historyApiFallback: true,
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js',
    publicPath: '/',
  },
  module: {
    rules: [
      {
        test: /\.(ts|tsx)$/,
        exclude: /node_modules/,
        resolve: {
          extensions: ['.ts', '.tsx', '.js', '.json'],
        },
        use: 'ts-loader',
      },
      {
        test: /\.css$/i,
        include: path.resolve(__dirname, 'src'),
        use: ['style-loader', 'css-loader', 'postcss-loader'],
      },
      {
        test: /\.worker.js$/,
        use: { loader: 'worker-loader' },
      }
    ]
  },
  devtool: prod ? undefined : 'source-map',
  plugins: [
    new Dotenv(),
    new ReactRefreshWebpackPlugin(),
  ],
};