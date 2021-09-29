module.exports = {
  presets: [
    "@babel/preset-typescript",
    ["@babel/preset-react", { runtime: "automatic" }],
    ["@babel/preset-env", { useBuiltIns: "usage", corejs: "3.8" }],
  ],
  plugins: [
    "babel-plugin-styled-components",
    "@babel/plugin-transform-runtime",
  ],
};
