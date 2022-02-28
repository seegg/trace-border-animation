const path = require('path');
const TerserPlugin = require('terser-webpack-plugin');


module.exports = {
  entry: ['./demo/index.tsx'],
  output: {
    path: path.join(__dirname, 'demo'),
    filename: 'bundle.js'
  },
  watch: true,
  mode: 'development',
  module: {
    rules: [
      {
        test: /\.(j|t)sx?$/i,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: [
              "@babel/preset-env",
              "@babel/preset-react",
              "@babel/preset-typescript"
            ],
          }
        }
      },
      {
        test: /\.css$/i,
        use: [
          "style-loader",
          {
            loader: "css-loader",
            options: {
              sourceMap: false
            }
          }
        ],
      },
    ]
  },
  optimization: {
    minimize: true,
    minimizer: [new TerserPlugin()],
  },
  resolve: {
    extensions: ['.js', '.jsx', '.ts', '.tsx', '.json'],
  },
  devtool: 'source-map',
}