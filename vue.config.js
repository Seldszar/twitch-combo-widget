const path = require("path");

const includePaths = [
  path.resolve(__dirname, "./node_modules/foundation-sites/scss"),
  path.resolve(__dirname, "./src/assets/scss"),
];

module.exports = {
  baseUrl: "",
  lintOnSave: false,
  productionSourceMap: false,
  css: {
    loaderOptions: {
      sass: { includePaths },
    },
  },
};
