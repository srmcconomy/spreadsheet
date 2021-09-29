const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
  mode: "development",
  performance: {
    maxAssetSize: 1000000000,
    maxEntrypointSize: 1000000000,
  },
  entry: path.resolve(__dirname, "src/Table.tsx"),
  output: {
    path: path.resolve(__dirname, "dist"),
    library: {
      name: "Table",
      type: "commonjs",
    },
  },
  module: {
    rules: [
      {
        test: /\.[jt]sx?$/,
        include: [path.resolve(__dirname, "src")],
        loader: "babel-loader",
      },
    ],
  },
  externals: {
    react: 'react',
    reactDOM: 'react-dom',
    coreJS: 'core-js',
    babelRuntime: '@babel/runtime',
    reactIs: 'react-is',
    styledComponents: 'styled-components'
  }
  resolve: {
    extensions: [".js", ".ts", ".jsx", ".tsx", ".json"],
  },
};
